import type { CracoConfig } from "@craco/types";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const config: CracoConfig = {
  eslint: {
    enable: true,
    mode: "file",
  },
  webpack: {
    alias: {},
    plugins: {},
    configure: (webpackConfig) => {
      if (webpackConfig.resolve && webpackConfig.resolve.plugins) {
        const plugins = webpackConfig.resolve.plugins;

        plugins.push(new TsconfigPathsPlugin({}));
      }

      return webpackConfig;
    },
  },
};

module.exports = config;
