import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Paper,
  Tab,
  Tabs,
  Container,
  Grid,
  Backdrop,
  Typography,
  Alert,
  Box,
  AlertTitle,
  Button,
  Link,
  Snackbar,
} from "@mui/material";

import ProcessList from "./ProcessList";
import ProcessConfig from "./ProcessConfig";
import { SpacemeshArgList, PostServiceArgList } from "../ArgumentLists"; // Adjust the path as necessary

function App() {
  const websocket = useSelector((state) => state.websocket);
  const [selectedTab, setSelectedTab] = useState(0);

  const [updateAvailable, setUpdateAvailable] = useState(false);
  const currentVersion = process.env.QUICKSMESH_VERSION;

  // Get latest release version
  useEffect(() => {
    fetch("https://api.github.com/repos/quicksmesh/QuickSmesh/releases/latest")
      .then((response) => response.json())
      .then((data) => {
        const latestVersion = data.tag_name;
        if (latestVersion && latestVersion !== currentVersion) {
          setUpdateAvailable(true);
        } else {
          setUpdateAvailable(false);
        }
      })
      .catch((error) => {
        console.log("Error fetching latest release:", error);
      });
  }, [currentVersion]);

  return (
    <>
      <CssBaseline enableColorScheme />
      <Snackbar open={updateAvailable}>
        <Alert
          onClose={() => {
            setUpdateAvailable(false);
          }}
          severity="info"
          variant="filled"
        >
          {"Update available! "}
          <Link
            color="inherit"
            href="https://github.com/quicksmesh/QuickSmesh/releases/latest"
            target="_blank"
          >
            Download the latest version.
          </Link>
        </Alert>
      </Snackbar>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!websocket.connected}
      >
        <Alert severity="error">
          <AlertTitle>WebSocket Disconnected</AlertTitle>
          Ensure the quicksmesh backend is running
        </Alert>
      </Backdrop>
      <Container>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Paper sx={{ mt: 2, p: 1 }} variant="outlined" color="primary">
              <Typography align="center" variant="h5">
                QuickSmesh Dashboard
              </Typography>
              <Typography align="center" variant="subtitle2">
                {currentVersion}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper variant="outlined">
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={selectedTab}
                  onChange={(event, newValue) => {
                    setSelectedTab(newValue);
                  }}
                  variant="fullWidth"
                >
                  <Tab label="Node Setup" />
                  <Tab label="Mining" />
                  <Tab label="Storage initialization" />
                </Tabs>
              </Box>
              {selectedTab === 0 && (
                <ProcessConfig
                  argList={SpacemeshArgList}
                  tag="Spacemesh node"
                  title="Configure Spacemesh Node"
                />
              )}
              {selectedTab === 1 && (
                <ProcessConfig
                  argList={PostServiceArgList}
                  tag="PoST Service"
                  title="Configure PoST Service"
                />
              )}
              {selectedTab === 2 && (
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" align="center">
                    Coming soon!
                  </Typography>
                  <Typography sx={{ my: 2 }} variant="body1" align="center">
                    For now you can initialize PoST data yourself using postcli
                    or you can download pre-generated data below
                  </Typography>
                  <Link href="http://quicksmesh.com" target="_blank">
                    <Button sx={{ my: 2 }} size="large" variant="contained">
                      Get pre-generated data
                    </Button>
                  </Link>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <ProcessList />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ height: 100 }} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
