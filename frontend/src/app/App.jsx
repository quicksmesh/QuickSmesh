import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "@mui/material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import ProcessList from "./ProcessList";
import ProcessConfig from "./ProcessConfig";
import NotificationSnackbar from "./NotificationSnackbar";
import { createNotification } from "../redux/notificationsSlice";
import { SpacemeshArgList, PostServiceArgList } from "../ArgumentLists"; // Adjust the path as necessary

function App() {
  const dispatch = useDispatch();
  const websocket = useSelector((state) => state.websocket);
  const [selectedTab, setSelectedTab] = useState(0);

  const currentVersion = process.env.QUICKSMESH_VERSION;

  // Get latest release version
  useEffect(() => {
    fetch("https://api.github.com/repos/quicksmesh/QuickSmesh/releases/latest")
      .then((response) => response.json())
      .then((data) => {
        const latestVersion = data.tag_name;
        if (latestVersion && !latestVersion.startsWith(currentVersion)) {
          dispatch(
            createNotification({
              message: "Update available! ",
              type: "info",
              link: {
                text: "Download the latest version.",
                href: "https://github.com/quicksmesh/QuickSmesh/releases/latest",
              },
            })
          );
        }
      })
      .catch((error) => {
        console.log("Error fetching latest release:", error);
      });
  }, [dispatch, currentVersion]);

  return (
    <>
      <CssBaseline enableColorScheme />

      <NotificationSnackbar />
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
