[nodePath, scriptPath, command, ...args] = process.argv;

const PRODUCTION = process.env['NODE_ENV'] === 'production';
const CMD = command, CMD_SERVE = 'serve', CMD_BUILD = 'build';
const CONFIG_FILE = './sassybars.config.json';
const HELPERS_FILE = './sassybars.helpers.js';

let fs = require('fs');
let del = require('del');
let path = require('path');
let glob = require('glob');
let bulbo = require('bulbo');
let data = require('gulp-data');
let sass = require('gulp-sass');
let gulpIf = require('gulp-if');
let through = require('through2');
let rename = require('gulp-rename');
let terser = require('gulp-terser');
let htmlMin = require('gulp-htmlmin');
let bundler = require('bundle-through');
let htmlTidy = require('gulp-htmltidy');
let livereload = require('gulp-livereload');
let handlebars = require('gulp-compile-handlebars');
let config = JSON.parse(fs.readFileSync(CONFIG_FILE).toString());
let helpers = require(HELPERS_FILE);

const SERVER_PORT = config['SERVER_PORT'];
const OUTPUT_DIRECTORY = config['OUTPUT_DIRECTORY'];
const CLEAN_OUTPUT_DIR = config['CLEAN_OUTPUT_DIR'];
const DATA_FILE = config['DATA_FILE'];
const OUTPUT_STYLE_FILENAME = config['OUTPUT_STYLE_FILENAME'];
const OUTPUT_SCRIPT_FILENAME = config['OUTPUT_SCRIPT_FILENAME'];
const STYLE_INDEX = config['STYLE_INDEX'];
const SCRIPT_INDEX = config['SCRIPT_INDEX'];
const PAGES_GLOB = config['PAGES_GLOB'];
const ASSETS_GLOB = config['ASSETS_GLOB'];
const SCRIPTS_GLOB = config['SCRIPTS_GLOB'];
const STYLES_GLOB = config['STYLES_GLOB'];
const PARTIALS_GLOB = config['PARTIALS_GLOB'];
const LIVERELOAD_GLOB = config['LIVERELOAD_GLOB'];
const HTML_LINT_OPTIONS = config['HTML_LINT_OPTIONS'];
const USE_HTML_LINT = config['USE_HTML_LINT'];

if(CMD === CMD_BUILD && CLEAN_OUTPUT_DIR) {
  del.sync(`${OUTPUT_DIRECTORY}/*`);
}

bulbo.asset(ASSETS_GLOB);

bulbo.asset(STYLE_INDEX)
  .watch(STYLES_GLOB)
  .pipe(sass({outputStyle: PRODUCTION ? 'compressed' : 'expanded'}).on('error', sass.logError))
  .pipe(rename(OUTPUT_STYLE_FILENAME));

bulbo.asset(SCRIPT_INDEX)
  .watch(SCRIPTS_GLOB)
  .pipe(bundler())
  .pipe(gulpIf(PRODUCTION, terser()))
  .pipe(rename(OUTPUT_SCRIPT_FILENAME));

bulbo.asset(PAGES_GLOB)
  .watch(PAGES_GLOB, PARTIALS_GLOB, DATA_FILE)
  .pipe(function() {
    let Handlebars = handlebars.Handlebars;

    return through.obj(function(file, enc, cb) {
      let fileNames = glob.sync(PARTIALS_GLOB);

      fileNames.forEach(fileName => {
        let partialName = path.basename(fileName, path.extname(fileName));
        let fileContents = fs.readFileSync(fileName).toString();

        try { Handlebars.unregisterPartial(partialName); } catch(err) { }
        Handlebars.registerPartial(partialName, fileContents);
      });

      this.push(file);
      cb();
    });
  }())
  .pipe(data(file => {
    let data = JSON.parse(fs.readFileSync(DATA_FILE).toString());
    let pageFileName = path.basename(file.path);
    let pageData = data[pageFileName];
    let envData = {};

    Object.keys(data).forEach(key => {
      if(!key.includes('.')) {
        envData[key] = data[key];
      }
    });

    if(pageData) {
      Object.keys(pageData).forEach(pageKey => {
        envData[pageKey] = pageData[pageKey];
      });
    }

    return Object.assign(envData, {
      OUTPUT_STYLE_FILENAME: OUTPUT_STYLE_FILENAME,
      OUTPUT_SCRIPT_FILENAME: OUTPUT_SCRIPT_FILENAME
    });
  }))
  .pipe(handlebars(null, {helpers: helpers}))
  .pipe(gulpIf(!PRODUCTION && USE_HTML_LINT, htmlTidy(HTML_LINT_OPTIONS)))
  .pipe(gulpIf(PRODUCTION, htmlMin({collapseWhitespace: true})));

if(CMD === CMD_SERVE) {
  bulbo.addMiddleware(() => require('connect-livereload')());
  bulbo.asset(LIVERELOAD_GLOB).pipe(livereload({start: true, quiet: true}));
}

bulbo.dest(OUTPUT_DIRECTORY);
bulbo.port(SERVER_PORT);
