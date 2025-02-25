module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }], // Enable automatic JSX runtime
    "@babel/preset-typescript"
  ]
};
