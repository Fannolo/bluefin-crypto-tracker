module.exports = {
  preset: "react-native",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  // Tell Jest to treat TypeScript files as ESM (if you're using TypeScript)
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  globals: {
    "babel-jest": {
      useESM: true,
    },
  },
};
