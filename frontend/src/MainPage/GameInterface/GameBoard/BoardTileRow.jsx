import TileRow from "../TileRow";

export default ({ children, style }) => {
  return (
    <TileRow style={{ padding: "3px 0px", ...(style || {}) }}>
      {children}
    </TileRow>
  );
};
