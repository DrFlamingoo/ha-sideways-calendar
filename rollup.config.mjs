import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/sideways-calendar-card.ts",
  output: {
    file: "dist/sideways-calendar-card.js",
    format: "es",
  },
  plugins: [
    typescript(),
    resolve(),
    terser(),
  ],
};
