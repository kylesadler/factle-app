import React from "react";
import Typography from "@mui/material/Typography";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";

export default ({ onHelpClick, onStatsClick, bannerText }) => {
  return (
    <div>
      {bannerText ? (
        <div
          style={{
            background: "linear-gradient(to right, #eea849, #f46b45)",
          }}
        >
          <Typography
            style={{ textAlign: "center", margin: "auto", fontWeight: "bold" }}
          >
            {bannerText}
          </Typography>
        </div>
      ) : (
        ""
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#121213",
          borderBottom: "1px solid #d3d6da",
        }}
      >
        <div
          style={{ padding: 15, cursor: "pointer", color: "white" }}
          onClick={onHelpClick}
        >
          <HelpOutlineIcon />
        </div>
        <Typography variant="h3" component="div">
          Factle
        </Typography>
        <div
          style={{ padding: 15, cursor: "pointer", color: "white" }}
          onClick={onStatsClick}
        >
          <LeaderboardOutlinedIcon />
        </div>
      </div>
    </div>
  );
};
