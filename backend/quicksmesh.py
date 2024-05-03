import os
import subprocess
import shlex
import json
import threading
import time
import traceback
import base64
import argparse
import contextlib
import webbrowser

import tornado.ioloop
import tornado.web
import tornado.websocket


class QuickSmesh:

    def __init__(self, io_loop):
        self._processes = {}                # Dictionary of created processes, keyed by process object
        self._processes_updated = False     # Indicates if _processes has been updates
        self._ws_clients = set()            # Set of current connected websocket clients
        self._io_loop = io_loop             # Tornado io loop
        self._lock = threading.Lock()       # Thread lock to protect _processes
        self._shutdown = False              # Used to terminate threads

        # Start auto update thread
        threading.Thread(target=self.auto_send_update).start()

    def handle_message(self, raw_message):
        '''
        Handles incoming websocket message from frontend
        '''
        try:
            message = json.loads(raw_message)
        except json.decoder.JSONDecodeError:
            print(f"Received invalid JSON: {raw_message}")
            return

        print(f"Received: {message}")

        command = message["command"]

        if command == "init":
            self.send_update_processes()
        if command == "run":
            self.run(message["tag"], message["cmd"])
        elif command == "terminate":
            self.terminate_process_by_pid(message["pid"])
        elif command == "remove":
            self.remove_process_by_pid(message["pid"])
        elif command == "check_post_service":
            # Work in progress
            (node_ids, post_id, post_id_exists) = self.check_post_service(m["post_dir"], m["node_dir"])
            payload = {"nodeIds": node_ids, "postId": post_id, "exists": post_id_exists}
            message = json.dumps({"action": "updatePostServiceState", "payload": payload})
            self.ws_send(message)

    @contextlib.contextmanager
    def update_processes_context(self):
        '''
        Since self._processes is updated in multiple threads we put a lock around the update to avoid race conditions and automatically set self._processes_updated
        '''
        with self._lock:
            yield
            self._processes_updated = True

    def auto_send_update(self):
        '''
        Thread which automatically sends a process updates to the frontend when ever a process updates
        '''
        while not self._shutdown:
            if self._processes_updated:
                self.send_update_processes()
            time.sleep(0.5)

    def send_update_processes(self):
        '''
        Send updateProcess action to frontend
        '''
        payload = [
            {
                "pid": proc.pid,
                "cmd": info["cmd"],
                "tag": info["tag"],
                "stdout": info["stdout"],
                "ended": info["ended"]
            } for proc, info in self._processes.items()
        ]
        message = json.dumps({"action": "updateProcesses", "payload": payload})
        self.ws_send(message)
        self._processes_updated = False

    def process_monitor(self, proc):
        '''
        Thread which monitors a process, it continuously reads stdout and appends it to the process entry
        '''
        while proc.poll() is None:
            line = proc.stdout.readline()
            if len(line) > 0:
                with self.update_processes_context():
                    self._processes[proc]["stdout"] += line
        with self.update_processes_context():
            self._processes[proc]["ended"] = True

    def run(self, tag, command):
        '''
        Run a new process and start the process monitor thread
        '''
        print(f"Running: {command}")

        # Create process
        try:
            proc = subprocess.Popen(shlex.split(command), stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        except Exception as e:
            # Send any errors to frontend
            print(e)
            message = json.dumps({"action": "createNotification", "payload": {"type": "error", "message": str(e)}})
            self.ws_send(message)
            return

        # Create process entry
        with self.update_processes_context():
            self._processes[proc] = {"tag": tag, "cmd": command, "stdout": "", "ended": False}

        # Start monitor thread
        threading.Thread(target=self.process_monitor, args=(proc,)).start()

        print(f"Process started: {proc.pid}")
        self.send_update_processes()

    def terminate_process_by_pid(self, pid):
        '''
        Terminate a running process based on its PID
        '''
        for proc in self._processes.keys():
            if str(proc.pid) == str(pid):
                found = True
                self.terminate_process(proc)
                self.send_update_processes()
                break

        if not found:
            print(f"Failed to find process with PID: {pid}")

    def terminate_process(self, proc):
        '''
        Cleanly terminate a running process
        '''
        print(f"Terminating [{proc.pid}] {proc.args[0]}")
        proc.terminate()
        try:
            proc.wait(timeout=20)
        except subprocess.TimeoutExpired:
            print("SIGTERM did not terminate the process, sending SIGKILL")
            proc.kill()

        if proc in self._processes.keys():
            with self.update_processes_context():
                self._processes[proc]["ended"] = True
                self._processes[proc]["stdout"] += "\nPROCESS TERMINATED BY APPLICATION"

    def remove_process_by_pid(self, pid):
        '''
        Remove a killed process from the process list
        '''
        print(f"removing {pid}")
        found = False
        for proc in self._processes.keys():
            if str(proc.pid) == str(pid):
                if self._processes[proc]["ended"] == True:
                    found = True
                    with self.update_processes_context():
                        self._processes.pop(proc)
                    self.send_update_processes()
                    print(f"Process {pid} removed")
                    break
                else:
                    print(f"Failed to remove process {pid}, still running")

        if not found:
            print(f"Failed to find process with PID: {pid}")

    def check_post_service(self, post_dir, node_dir):
        '''
        WORK IN PROGRESS

        Checks if the PoST directory's key is present in the node's identify directory
        '''
        # List all node identities
        node_ids = []
        identities_dir = os.path.join(node_dir, "identities")
        for filename in os.listdir(identities_dir):
            if filename.endswith(".key"):
                file_path = os.path.join(identities_dir, filename)
                with open(file_path, 'r') as f:
                    data = f.read()
                    node_ids.append({"file": filename, "key": data[:63], "id": data[64:]})

        # Get post id
        post_metadata_path = os.path.join(post_dir, "postdata_metadata.json")
        with open(post_metadata_path) as f:
            metadata = json.loads(f.read())
            post_id_b64 = metadata["NodeId"]
            post_id_bytes = base64.b64decode(post_id_b64)
            post_id_hex = "".join(f"{b:02x}" for b in post_id_bytes)

        # Check of post id exist in node identities
        post_id_exists = False
        for item in node_ids:
            if item["id"] == post_id_hex:
                post_id_exists = True
                break

        return (node_ids, post_id_hex, post_id_exists)

    def add_ws_client(self, client):
        self._ws_clients.add(client)

    def remove_ws_client(self, client):
        self._ws_clients.remove(client)

    def ws_send(self, message):
        '''
        Sends a websocket message to the frontend
        '''
        # Callback must be run from Tornado io loop
        def write_all(m):
            for client in self._ws_clients:
                client.write_message(m)

        self._io_loop.add_callback(write_all, message)

    def cleanup(self):
        '''
        Terminate all running processes and stop all threads
        '''
        print(f"Cleaning up...")
        self._shutdown = True
        for proc in self._processes.keys():
            if proc and proc.poll() is None:
                self.terminate_process(proc)


class WSHandler(tornado.websocket.WebSocketHandler):

    def check_origin(self, origin):
        print(f"Connection request from: {origin}")
        return True

    def initialize(self, qs):
        self.qs = qs

    def open(self):
        print("Client connected")
        self.qs.add_ws_client(self)

    def on_message(self, message):
        try:
            self.qs.handle_message(message)
        except Exception as e:
            print(f"An exception occurred handling message: {message}")
            traceback.print_exc()

    def on_close(self):
        print("Client disconnected")
        self.qs.remove_ws_client(self)


def main(port, frontend_dir, no_frontend):

    if not no_frontend and not os.path.isdir(frontend_dir):
        print(f"Frontend static directory not found: {frontend_dir}")
        no_frontend = True

    io_loop = tornado.ioloop.IOLoop.current()
    qs = QuickSmesh(io_loop)

    # Always include websocket handler
    handlers = [(r"/ws", WSHandler, {'qs': qs})]

    # Only add static handler when running with frontend
    if not no_frontend:
        handlers.append((r"/(.*)", tornado.web.StaticFileHandler, {"path": frontend_dir, "default_filename": "index.html"}))

    app = tornado.web.Application(handlers)
    app.listen(port)

    # Automatically open browser window
    if no_frontend:
        print("Frontend will not be served")
    else:
        local_url = f"http://localhost:{port}"
        print(f"Serving frontend on: {local_url}")
        webbrowser.open(local_url, new=0, autoraise=True)

    print("Running...")
    try:
        io_loop.start()
    except KeyboardInterrupt:
        pass

    # Terminate all running threads and processes
    qs.cleanup()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="QuickSmesh backend application", formatter_class=argparse.ArgumentDefaultsHelpFormatter)

    parser.add_argument('--port', type=int, default=8899, help='Port number which will host frontend and websocket')
    parser.add_argument('--frontend-dir', type=str, default=os.path.join(os.path.dirname(__file__), "dist"), help='Path to frontend static folder which contains index.html')
    parser.add_argument('--no-frontend', action='store_true', help='Do not server frontend (useful during development)')

    args = parser.parse_args()
    main(args.port, args.frontend_dir, args.no_frontend)
