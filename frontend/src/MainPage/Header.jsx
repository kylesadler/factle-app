import React from "react";
import Typography from "@mui/material/Typography";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import AssistantIcon from "@mui/icons-material/Assistant";
import { Tooltip } from "@mui/material";

const ToolTipIcon = ({ onClick, children, tooltip }) => {
  return (
    <Tooltip title={tooltip}>
      <div
        style={{ padding: 15, cursor: "pointer", color: "white" }}
        onClick={onClick}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default ({ onHelpClick, onStatsClick, bannerText, onFeedbackClick }) => {
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
        <ToolTipIcon onClick={onHelpClick} tooltip={"How to Play"}>
          <HelpOutlineIcon />
        </ToolTipIcon>
        <Typography variant="h3" component="div">
          Factle
        </Typography>
        <div style={{ display: "flex" }}>
          {/* <ToolTipIcon onClick={onFeedbackClick} tooltip={"Give Feedback"}>
            <AssistantIcon />
          </ToolTipIcon> */}
          <ToolTipIcon onClick={onStatsClick} tooltip={"Statistics"}>
            <LeaderboardOutlinedIcon />
          </ToolTipIcon>
        </div>
      </div>
    </div>
  );
};
