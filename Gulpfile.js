// Modern Gulpfile with async/await, modular tasks, and improved config
const gulp = require("gulp");
const fs = require("fs");
const { rimraf } = require("rimraf");
const gulpLoadPlugins = require("gulp-load-plugins");
const plugins = gulpLoadPlugins();
const noop = require("gulp-noop");
const uglify = require("gulp-uglify-es").default;
const { rollup } = require("rollup");
const rollupBabel = require("@rollup/plugin-babel").default;
const rollupResolve = require("@rollup/plugin-node-resolve").default;
const rollupCommonjs = require("@rollup/plugin-commonjs");
const sass = require("gulp-sass")(require("sass"));
const javascriptObfuscator = require("gulp-javascript-obfuscator");
const path = require("path");
const rev = require("gulp-rev");
const Vinyl = require("vinyl");
const { Readable } = require("stream");

// Configurable options (adjusted for your structure)
const config = {
  assetsCssDir: "src/assets/scss",
  assetsJsDir: "src/assets/js",
  libCssDir: "src/library/scss",
  libJsDir: "src/library/js",
  nodeDir: "node_modules",
  sassPattern: "scss/**/*.scss",
  jsPattern: "js/**/*.js",
  cssManifestPath: "dist/rev/manifest-css.json",
  jsManifestPath: "dist/rev/manifest-js.json",
  cssOutDir: "dist/css",
  jsOutDir: "dist/js",
};

// Utility: Remove old hashed files not in manifest
function cleanupOldFiles(dir, manifestPath, ext) {
  return async function cleanupTask(done) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      const keepFiles = new Set(Object.values(manifest));
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (file.endsWith(ext) && !keepFiles.has(file)) {
          fs.unlinkSync(path.join(dir, file));
          // Also try to remove sourcemap if present
          const mapFile = file + ".map";
          if (fs.existsSync(path.join(dir, mapFile))) {
            fs.unlinkSync(path.join(dir, mapFile));
          }
        }
      }
      done && done();
    } catch (e) {
      console.error("[Cleanup] Error:", e);
      done && done(e);
    }
  };
}

gulp.task(
  "clean-old-js",
  cleanupOldFiles(config.jsOutDir, config.jsManifestPath, ".js")
);
gulp.task(
  "clean-old-css",
  cleanupOldFiles(config.cssOutDir, config.cssManifestPath, ".css")
);

// Detect production mode at runtime via NODE_ENV or --production
function isProduction() {
  return (
    process.env.NODE_ENV === "production" ||
    process.argv.includes("--production")
  );
}
function useSourceMaps() {
  return !isProduction(); // Enable sourcemaps in dev, disable in production
}

// Helper to set production env when running the `prod` task so behaviour is deterministic
function setProdEnv(done) {
  process.env.NODE_ENV = "production";
  done && done();
}

// Utility: Run a series of tasks in sequence (replaces Pipeline/Q)
async function runPipeline(entries, taskFn) {
  for (const entry of entries) {
    await new Promise((resolve, reject) => {
      const stream = taskFn(...entry);
      stream.on("end", resolve);
      stream.on("error", reject);
    });
  }
}

// Asset helpers

function addAllStyles(done) {
  const entries = styleEntries.map(([srcArr, outName]) =>
    gulp
      .src(srcArr)
      .pipe(plugins.plumber({ errorHandler: onError }))
      .pipe(useSourceMaps() ? plugins.sourcemaps.init() : noop())
      .pipe(sass())
      .pipe(plugins.concat(outName))
      .pipe(isProduction() ? plugins.cleanCss() : noop())
      .pipe(rev())
      .pipe(useSourceMaps() ? plugins.sourcemaps.write(".") : noop())
      .pipe(gulp.dest(config.cssOutDir))
  );
  return require("merge-stream")(...entries)
    .pipe(rev.manifest(config.cssManifestPath))
    .pipe(gulp.dest("."));
}

// Helper to create vinyl stream from rollup bundle
async function rollupBundle(inputPath, outputName, format, globalName) {
  const bundle = await rollup({
    input: inputPath,
    plugins: [
      rollupResolve({ browser: true }),
      rollupCommonjs(),
      rollupBabel({
        babelHelpers: "bundled",
        babelrc: false,
        exclude: "node_modules/**",
      }),
    ],
  });

  const { output } = await bundle.generate({
    format,
    name: globalName,
    inlineDynamicImports: true,
    sourcemap: useSourceMaps(),
  });

  await bundle.close();

  const chunk = output[0];
  const file = new Vinyl({
    path: outputName,
    contents: Buffer.from(chunk.code),
  });

  if (chunk.map && useSourceMaps()) {
    file.sourceMap = chunk.map;
  }

  return file;
}

// ESM output (for <script type="module">)

async function addAllScriptsESM() {
  const files = await Promise.all(
    scriptEntries.map(([srcArr, outName]) =>
      rollupBundle(srcArr[0], outName, "esm", undefined)
    )
  );

  const stream = Readable.from(files, { objectMode: true });

  return new Promise((resolve, reject) => {
    stream
      .pipe(plugins.plumber({ errorHandler: onError }))
      .pipe(useSourceMaps() ? plugins.sourcemaps.init({ loadMaps: true }) : noop())
      .pipe(isProduction() ? uglify() : noop())
      .pipe(isProduction() ? javascriptObfuscator() : noop())
      .pipe(rev())
      .pipe(useSourceMaps() ? plugins.sourcemaps.write(".") : noop())
      .pipe(gulp.dest(config.jsOutDir))
      .pipe(rev.manifest(config.jsManifestPath))
      .pipe(gulp.dest("."))
      .on("end", resolve)
      .on("error", reject);
  });
}

// IIFE output (for <script nomodule>)
// Map entry names to IIFE global names (only libraries need a name, app entries don't)
const iifeNames = {
  "form-guardian.js": "FormGuardian", // Library bundle - expose as global
};

async function addAllScriptsIIFE() {
  const files = await Promise.all(
    scriptEntries.map(([srcArr, outName]) => {
      const iifeOutName = outName.replace(/\.js$/, ".iife.js");
      return rollupBundle(srcArr[0], iifeOutName, "iife", iifeNames[outName]);
    })
  );

  const stream = Readable.from(files, { objectMode: true });

  return new Promise((resolve, reject) => {
    stream
      .pipe(plugins.plumber({ errorHandler: onError }))
      .pipe(useSourceMaps() ? plugins.sourcemaps.init({ loadMaps: true }) : noop())
      .pipe(isProduction() ? uglify() : noop())
      .pipe(isProduction() ? javascriptObfuscator() : noop())
      .pipe(rev())
      .pipe(useSourceMaps() ? plugins.sourcemaps.write(".") : noop())
      .pipe(gulp.dest(config.jsOutDir))
      .pipe(rev.manifest(config.jsManifestPath, { merge: true }))
      .pipe(gulp.dest("."))
      .on("end", resolve)
      .on("error", reject);
  });
}

function onError(err) {
  console.error("[Error]", err.toString());
  if (this && typeof this.emit === "function") this.emit("end");
}

gulp.task("clean", async function () {});

// Clean output folders before each build
gulp.task("clean-js", async function () {
  await rimraf(config.jsOutDir + "/*", { glob: true });
});
gulp.task("clean-css", async function () {
  await rimraf(config.cssOutDir + "/*", { glob: true });
});
gulp.task("clean", async function () {
  await rimraf("dist/**", { glob: true });
});

const styleEntries = [
  [[config.libCssDir + "/index.scss"], "form-guardian.css"],
  [[config.assetsCssDir + "/main.scss"], "main.css"],
];

const scriptEntries = [
  [[config.libJsDir + "/index.js"], "form-guardian.js"],
  [[config.assetsJsDir + "/main.js"], "main.js"],
];

gulp.task("styles", gulp.series("clean-css", addAllStyles));

// Run cleanup after styles
gulp.task("styles-clean", gulp.series("styles", "clean-old-css"));

gulp.task(
  "scripts",
  gulp.series("clean-js", addAllScriptsESM, addAllScriptsIIFE)
);

// Run cleanup after scripts
gulp.task("scripts-clean", gulp.series("scripts", "clean-old-js"));

// Watch task

gulp.task("watch", function () {
  gulp.watch(
    [config.libCssDir + "/**/*.scss", config.assetsCssDir + "/**/*.scss"],
    gulp.series("styles-clean")
  );

  gulp.watch(
    [config.libJsDir + "/**/*.js", config.assetsJsDir + "/**/*.js"],
    gulp.series("scripts-clean")
  );
});

// Default and dev/prod tasks (must be last)
gulp.task(
  "dev_with_watch",
  gulp.series("clean", "styles-clean", "scripts-clean", "watch")
);

// Default and dev/prod tasks (must be last)
gulp.task("dev", gulp.series("clean", "styles-clean", "scripts-clean"));

// Prod task: set NODE_ENV and run the full clean/build without sourcemaps
gulp.task(
  "prod",
  gulp.series(setProdEnv, "clean", "styles-clean", "scripts-clean")
);

gulp.task("default", gulp.series("dev"));
