const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;

// For React Native below v0.72.0 you need to also add:
config.resolver.sourceExts.push("cjs");

module.exports = config;
