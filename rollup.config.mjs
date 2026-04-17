import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/ha-hello-world-card.ts",
  output: {
    file: "dist/ha-hello-world-card.js",
    format: "es",
  },
  plugins: [
    typescript(),
    resolve(),
    terser(),
  ],
};
