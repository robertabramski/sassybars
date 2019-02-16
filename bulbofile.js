[nodePath, scriptPath, command, ...args] = process.argv;

const SERVER_PORT = 8080;
const OUTPUT_DIRECTORY = 'dist';
const OUTPUT_STYLE_FILENAME = 'style.css';
const OUTPUT_SCRIPT_FILENAME = 'script.js';

const DATA_FILE = './src/data.json';
const STYLE_INDEX = './src/styles/index.scss';
const SCRIPT_INDEX = './src/scripts/index.js';
const LIVERELOAD_GLOB = './src/**/*.*';
const PAGES_GLOB = './src/pages/*.html';
const ASSETS_GLOB = './src/assets/**/*.*';
const SCRIPTS_GLOB = './src/scripts/*.js';
const STYLES_GLOB = './src/styles/*.scss';
const PARTIALS_GLOB = './src/partials/*.html';

const PRODUCTION = process.env['NODE_ENV'] === 'production';
const CMD = command, CMD_SERVE = 'serve', CMD_BUILD = 'build';

let fs = require('fs');
let bulbo = require('bulbo');
let data = require('gulp-data');
let sass = require('gulp-sass');
let gulpIf = require('gulp-if');
let rename = require('gulp-rename');
let terser = require('gulp-terser');
let htmlMin = require('gulp-htmlmin');
let bundler = require('bundle-through');
let livereload = require('gulp-livereload');
let handlebars = require('gulp-compile-handlebars');

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
    let path = require('path');
    let glob = require('glob');
    let through = require('through2');
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
    return JSON.parse(fs.readFileSync(DATA_FILE).toString());
  }))
  .pipe(handlebars(null))
  .pipe(gulpIf(PRODUCTION, htmlMin({collapseWhitespace: true})));

if(CMD === CMD_SERVE) {
  bulbo.addMiddleware(() => require('connect-livereload')());
  bulbo.asset(LIVERELOAD_GLOB).pipe(livereload({start: true, quiet: true}));
}

bulbo.dest(OUTPUT_DIRECTORY);
bulbo.port(SERVER_PORT);
