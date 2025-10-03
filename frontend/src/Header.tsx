import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Header: React.FC = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5e7eb",
        color: "#65758b",
        width: "100%",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700, p: "0 0 0 10%" }}>
          Stooorage
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
