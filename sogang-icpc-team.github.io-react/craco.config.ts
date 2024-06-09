import type { CracoConfig } from "@craco/types";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const config: CracoConfig = {
  webpack: {
    alias: {},
    plugins: {},
    configure: (webpackConfig) => {
      webpackConfig.resolve?.plugins?.push(new TsconfigPathsPlugin({}));
      return webpackConfig;
    },
  },
};

module.exports = config;
