import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import {
  TextField,
  Button,
  Grid,
  Box,
  Collapse,
  IconButton,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";

import { convertArgsToString } from "../helpers";
import { websocketSend } from "../WebSocket";

const ArgRow = ({
  arg,
  display,
  info,
  defaultValue,
  disabled,
  args,
  setArgs,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
      <Tooltip title={info} placement="right">
        <InfoIcon sx={{ mr: 1, my: 2 }} />
      </Tooltip>
      <TextField
        label={display}
        fullWidth
        value={args[arg]}
        onChange={(e) => {
          setArgs({ ...args, [arg]: e.target.value });
        }}
        disabled={disabled}
      />
      {/* <Tooltip title={defaultValue}>
        <Button startIcon={<ReplayIcon />} sx={{ ml: 1, my: 1 }}>
          Reset
        </Button>
      </Tooltip> */}
    </Box>
  );
};

const ProcessConfig = ({ argList, tag, title }) => {
  // Convert argList to state object
  const initialState = argList.reduce((acc, item) => {
    acc[item.arg] = item.defaultValue;
    return acc;
  }, {});

  const [args, setArgs] = useState(initialState);
  const [cmdString, setCmdString] = useState("");
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [editEnabled, setEditEnabled] = useState(false);

  // Split arg list into advanced and non advanced
  const advancedArgList = [];
  const nonAdvancedArgList = [];
  argList.forEach((item) => {
    if (item.advanced) {
      advancedArgList.push(item);
    } else {
      nonAdvancedArgList.push(item);
    }
  });

  // Update cmdString every time args change
  useEffect(() => {
    setCmdString(convertArgsToString(args));
  }, [args]);

  const handleButtonClick = () => {
    websocketSend({ command: "run", tag: tag, cmd: cmdString });
  };

  const handleExpandClick = () => {
    setAdvancedExpanded(!advancedExpanded);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h6">{title}</Typography>
          <Divider sx={{ my: 1 }} />
        </Grid>
        {argList.map(
          (item, index) =>
            !item.advanced && (
              <Grid key={index} item xs={11}>
                <ArgRow
                  arg={item.arg}
                  display={item.display}
                  info={item.info}
                  defaultValue={item.defaultValue}
                  disabled={editEnabled}
                  args={args}
                  setArgs={setArgs}
                />
              </Grid>
            )
        )}

        <Grid item xs={12}>
          <Button
            color="secondary"
            size="small"
            onClick={handleExpandClick}
            startIcon={
              advancedExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
            }
          >
            {advancedExpanded ? "Hide advanced" : "Show advanced"}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Collapse in={advancedExpanded} timeout="auto" unmountOnExit>
            <Grid container spacing={2}>
              {argList.map(
                (item, index) =>
                  item.advanced && (
                    <Grid key={index} item xs={11}>
                      <ArgRow
                        arg={item.arg}
                        display={item.display}
                        info={item.info}
                        defaultValue={item.defaultValue}
                        disabled={editEnabled}
                        args={args}
                        setArgs={setArgs}
                      />
                    </Grid>
                  )
              )}
            </Grid>
          </Collapse>
        </Grid>

        <Grid item xs={10}>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <IconButton
              sx={{ mr: 2, my: 0.5 }}
              size="small"
              onClick={() => {
                setEditEnabled(!editEnabled);
              }}
            >
              {editEnabled ? <EditOffIcon /> : <EditIcon />}
            </IconButton>
            <TextField
              sx={{ pr: 2 }}
              label="Command"
              value={cmdString}
              variant="standard"
              fullWidth
              disabled={!editEnabled}
              onChange={(e) => {
                setCmdString(e.target.value);
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={5} sm={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            endIcon={<DirectionsRunIcon />}
          >
            Run
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProcessConfig;
