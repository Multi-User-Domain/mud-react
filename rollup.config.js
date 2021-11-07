//import pkg from "./package.json";
import typescript from "@rollup/plugin-typescript";
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from "@rollup/plugin-json";
import css from 'rollup-plugin-css-only';
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

export default {
  input: "./index.tsx",
  plugins: [
    css({ output: 'styles.css', }),
    nodeResolve({ 
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        module: true,
        preferBuiltins: false,
        browser: true
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'development' ),
      'preventAssignment': true
    }),
    babel({ presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "@babel/preset-react",
      "@babel/preset-typescript",
      ],
      plugins: [],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      exclude: 'node_modules/**'
    }),
    commonjs({
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        include: /node_modules/
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      exclude: 'node_modules/**'
    }),
    json(),
    serve({
        open: true,
        verbose: true,
        contentBase: ["", "public"],
        host: "localhost",
        port: 3000,
    }),
    livereload({ watch: "dist" })
  ],
  external: [
    '@inrupt/solid-client',
    '@inrupt/solid-client-authn-core',
  ],
  paths: {
    "react": "https://unpkg.com/react@17/umd/react.development.js",
    "react-dom": "https://unpkg.com/react-dom@17/umd/react-dom.development.js",
    "@inrupt/solid-client": "https://unpkg.com/@inrupt/solid-client@1.13.3/dist/index.js",
  },
  output: {
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
    },
    // hack from a strange issue: https://github.com/rollup/rollup-plugin-commonjs/issues/6#issuecomment-519537010
    intro: 'const global = window;',
    file: "dist/index.js",
    //dir: 'dist',
    format: "iife",
    //sourcemap: true,
  }
};
