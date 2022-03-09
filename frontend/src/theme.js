import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  typography: {
    // fontFamily: "Hepta Slab", // needs to be bold
    fontFamily:
      "nyt-karnakcondensed, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande",
    h1: { color: "white" },
    h2: { color: "white" },
    h3: {
      color: "white",
      fontWeight: 700,
    },
    h4: { color: "white" },
    h5: { color: "white" },
    h6: { color: "white" },
    body: { color: "white" },
    body1: { color: "white" },

    button: {
      textTransform: "none",
    },
  },
});
theme = responsiveFontSizes(theme);

export default theme;
