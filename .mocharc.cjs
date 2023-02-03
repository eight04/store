module.exports = {
  "require": "ts-node/register",
  "loader": "ts-node/esm",
  "extensions": ["ts", "tsx", "mts"],
  "spec": [
    "test/*"
  ],
  "watch-files": [
    ".mts"
  ]
};
