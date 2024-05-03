import { updateProcesses } from "./redux/processSlice";
import { setConnected } from "./redux/websocketSlice";

import store from "./redux/store";

export default function WebSocketConnect() {
  window.ws = new WebSocket("ws://localhost:8899/ws");
  window.ws.onopen = function () {
    console.log("Websocket open");
    store.dispatch(setConnected(true));
    websocketSend({ command: "init" });
  };

  window.ws.onmessage = function (e) {
    handleIncoming(JSON.parse(e.data));
  };

  window.ws.onclose = function (e) {
    console.log(
      "Socket is closed. Reconnect will be attempted in 1 second.",
      e.reason
    );
    setTimeout(function () {
      WebSocketConnect();
    }, 1000);
    store.dispatch(setConnected(false));
    window.ws = undefined;
  };

  window.ws.onerror = function (err) {
    console.error("Socket encountered error: ", err.message, "Closing socket");
    window.ws.close();
  };
}

export function websocketSend(message) {
  if (window.ws && window.ws.readyState === 1) {
    window.ws.send(JSON.stringify(message));
  } else {
    console.error("failed to send message, websocket not connected");
  }
}

function handleIncoming(message) {
  switch (message?.action) {
    case "updateProcesses": {
      store.dispatch(updateProcesses(message.payload));
      break;
    }
    default: {
      console.log("unknown message:", message);
    }
  }
}
