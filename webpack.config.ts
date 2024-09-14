import webpack, { Configuration, ResolveOptions } from "webpack";
import path from "path";

const config: webpack.Configuration = {
  resolve: {
    modules: ["node_modules", "src"],
    fallback: {
      fs: false,
    },
    alias: {
      handlebars: "handlebars/runtime.js",
    },
  },
};

export default config;
