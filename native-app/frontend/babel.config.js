module.exports = function (api) {
  assets: ["./assets/fonts"];
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
