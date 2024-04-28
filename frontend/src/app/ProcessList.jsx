import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import {
  Stack,
  Typography,
  Paper,
  IconButton,
  Collapse,
  Box,
  Button,
  Alert,
  Divider,
  TextField,
} from "@mui/material";

import ConsoleOutput from "./ConsoleOutput";
import { websocketSend } from "../WebSocketConnect";
import { hideProcess } from "../redux/processSlice";
/* chatGPT prompt:
Using modern material ui (mui) write a component called ProcessList which creates a mui Stack of ProcessRow components each row displays the process's tag, pid and args, when the row is expanded the process logs are displayed. 
ProcessRow should have props: tag, pid, cmd, stdout (all of which are strings)
ProcessTable should have a single prop called processes in the form [{pid: "pid1", tag:"a", cmd: "b", stdout: "c"}, {pid: "pid2", tag:"a", cmd: "b", stdout: "c"}}
*/

// ProcessRow component
const ProcessRow = ({ tag, pid, cmd, stdout, ended, hideCallback }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const stopCallback = (pid) => {
    websocketSend({ command: "terminate", pid });
  };
  return (
    <Paper variant="outlined">
      <Box
        display="flex"
        sx={{
          flexDirection: "row",
          alignItems: "center",
          pr: 2,
          pl: 2,
          backgroundColor: ended ? "#fdeded" : "#edf7ed",
        }}
      >
        <Typography variant="h6">{tag}</Typography>
        {ended ? (
          <Alert severity="error">Stopped</Alert>
        ) : (
          <Alert severity="success">Running</Alert>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {ended && (
          <IconButton
            onClick={() => {
              hideCallback(pid);
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
        <IconButton onClick={handleExpandClick}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Typography sx={{ pl: 2, mt: 2 }} variant="body2">
          Command
        </Typography>
        <TextField
          sx={{ pl: 2, pr: 5 }}
          defaultValue={cmd}
          variant="standard"
          fullWidth
          disabled
        />
        <Typography sx={{ pl: 2, mt: 2 }} variant="body2">
          Output
        </Typography>
        <Box sx={{ pt: 1, pb: 2, pl: 2, pr: 2 }}>
          <ConsoleOutput stdout={stdout} />
        </Box>
        {!ended && (
          <Button
            variant="contained"
            size="small"
            color="error"
            sx={{ m: 2 }}
            startIcon={<BlockIcon />}
            onClick={() => {
              stopCallback(pid);
            }}
          >
            Terminate
          </Button>
        )}
      </Collapse>
    </Paper>
  );
};

// ProcessList component
const ProcessList = () => {
  const dispatch = useDispatch();
  const processes = useSelector((state) => state.processes);

  return (
    <Stack spacing={2}>
      {processes.active.map((process, index) => {
        if (processes.hidden.includes(process.pid)) {
          return null;
        } else {
          return (
            <ProcessRow
              key={index}
              {...process}
              hideCallback={(pid) => {
                dispatch(hideProcess(pid));
              }}
            />
          );
        }
      })}
    </Stack>
  );
};

export default ProcessList;
