import React from "react";

export default ({ children, style = {} }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
