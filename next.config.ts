module.exports = {
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Example of custom Webpack settings
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};
