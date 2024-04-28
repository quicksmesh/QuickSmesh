import React, { useRef, useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";

const ConsoleOutput = ({ stdout }) => {
  const textRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Detect when we are scrolled to bottom
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = textRef.current;
      setIsAtBottom(scrollHeight - scrollTop === clientHeight);
    };
    textRef.current.addEventListener("scroll", handleScroll);
    return () => {
      textRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Automatically scroll to the bottom if we are currently at the bottom
  useEffect(() => {
    if (isAtBottom && textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [stdout, isAtBottom]);

  return (
    <Paper sx={{ p: 2 }} variant="outlined">
      <Typography
        sx={{ whiteSpace: "pre", overflow: "auto", maxHeight: 400 }}
        variant="body2"
        ref={textRef}
        component="div"
      >
        <pre>{stdout}</pre>
      </Typography>
    </Paper>
  );
};

export default ConsoleOutput;
