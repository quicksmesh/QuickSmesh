import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";

function CustomTabPanel({ children, value, index }) {
  if (value === index) {
    return <Box sx={{ p: 3 }}>{<pre>{children}</pre>}</Box>;
  }
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const processes = useSelector((state) => state.processes);

  const first_pid = Object.keys(processes)[0];
  const stdout = processes?.[first_pid]?.stdout;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {stdout || []}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {[]}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {[]}
      </CustomTabPanel>
    </Box>
  );
}
