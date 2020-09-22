import resolve from "@rollup/plugin-node-resolve"
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import replace from "@rollup/plugin-replace";
import autoExternal from "rollup-plugin-auto-external"
import internal from "rollup-plugin-internal"
import path from "path"

// Rollup hoists Ink's dynamic require of react-devtools-core which causes
// a window not found error so we exclude Ink's devtools file for now.
function excludeDevTools() {
  const re = /ink/
  return {
    name: "ignoreDevTools",

    load(id) {
      if (id.match(re)) {
        if (path.parse(id).name === `devtools`) {
          return { code: `` }
        }
      }
    },
  }
}

export default {
  
  input: {
    index: `src/index.js`,
    "graphql-server/server": `src/graphql-server/server.js`
  },
  output: {
    dir: `dist`,
    entryFileNames: `[name].js`,
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    replace({
      values: {
        "process.env.NODE_ENV": JSON.stringify(`production`)
      }
    }),
    excludeDevTools(),
    json(),
    babel({
      babelHelpers: `runtime`,
      skipPreflightCheck: true,
      exclude: `node_modules/**`,
    }),
        commonjs({
          transformMixedEsModules: true
        }),
    resolve({
      dedupe: [
        `react`,
        `ink`,
        `ink-select-input`,
        `ink-spinner`,
        `terminal-link`,
        `react-reconcilier`,
        `@mdx-js/mdx`,
        `@mdx-js/react`,
        `@mdx-js/runtime`,
        `urql`, 
        `subscriptions-transport-ws`,
      ]
    }),
    autoExternal(),
    internal([
      `react`,
      `ink`,
      `ink-select-input`,
      `ink-spinner`,
      `terminal-link`,
      `react-reconcilier`,
      `@mdx-js/mdx`,
      `@mdx-js/react`,
      `@mdx-js/runtime`,
      `urql`,
      `subscriptions-transport-ws`,
    ]),
  ],
  external: [
    `ws`,
    `gatsby-telemetry`,
    `gatsby-core-utils`,
    `yoga-layout-prebuilt`,
  ],
}
