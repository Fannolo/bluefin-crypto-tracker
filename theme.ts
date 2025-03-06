import { createTheme } from "@shopify/restyle";

const palette = {
  primary: "#2cb9b0",
  secondary: "#0c0d34",
  white: "#ffffff",
  grey: "#f0f0f0",
};

const theme = createTheme({
  colors: {
    background: palette.white,
    primary: palette.primary,
    text: palette.secondary,
    card: palette.grey,
  },
  buttonVariants: {
    defaults: {
      borderRadius: 20,
      backgroundColor: "background",
      paddingVertical: "l",
      paddingHorizontal: "xl",
      marginTop: "xl",
    },
    primary: {
      borderRadius: 20,
      backgroundColor: "background",
      paddingVertical: "l",
      paddingHorizontal: "xl",
      marginTop: "xl",
    },
    disabled: {
      borderRadius: 20,
      backgroundColor: "background",
      paddingVertical: "l",
      paddingHorizontal: "xl",
      marginTop: "xl",
    },
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontSize: 24,
      fontWeight: "bold",
      color: "text",
    },
    body: {
      fontSize: 16,
      color: "text",
    },
  },
  breakpoints: {},
});

export type Theme = typeof theme;
export default theme;
