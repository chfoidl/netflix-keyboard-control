import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import camelCase from "lodash.camelcase";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import { uglify } from "rollup-plugin-uglify";

const pkg = require("./package.json");
const libraryName = "netflix-keyboard-control";

const config = {
    input: `src/index.ts`,
    output: [
        { file: pkg.main, name: camelCase(libraryName), format: "iife" }
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
        include: "src/**"
    },
    plugins: [
        // Allow json resolution
        json(),
        // Compile TypeScript files
        typescript({ useTsconfigDeclarationDir: true }),
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        commonjs(),
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        resolve()
    ]
};

if (process.env.BUILD === "production") {
    config.plugins.push(uglify());
} else {
    config.plugins.push(sourceMaps());
}

export default config;
