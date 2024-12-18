const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql"); // <--- add this

module.exports = config;

// https://docs.sentry.io/platforms/react-native/session-replay/#react-component-names
