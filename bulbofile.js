[nodePath, scriptPath, command, ...args] = process.argv;

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

bulbo.asset('./src/assets/**/*.*');

bulbo.asset('./src/styles/index.scss')
  .watch('./src/styles/*.scss')
  .pipe(sass({outputStyle: PRODUCTION ? 'compressed' : 'expanded'}).on('error', sass.logError))
  .pipe(rename('style.css'));

bulbo.asset('./src/scripts/index.js')
  .watch('./src/scripts/*.js')
  .pipe(bundler())
  .pipe(gulpIf(PRODUCTION, terser()))
  .pipe(rename('script.js'));

bulbo.asset('./src/pages/*.html')
  .watch('./src/pages/*.html', './src/partials/*.html', './src/data.json')
  .pipe(data(file => {
    return JSON.parse(fs.readFileSync('./src/data.json').toString());
  }))
  .pipe(handlebars(null, {batch: ['./src/partials']}))
  .pipe(gulpIf(PRODUCTION, htmlMin({collapseWhitespace: true})));

if(CMD === CMD_SERVE) {
  bulbo.addMiddleware(() => require('connect-livereload')());
  bulbo.asset('./src/**/*.*').pipe(livereload({
    start: true,
    quiet: true
  }));
}

bulbo.dest('dist');
bulbo.port(8080);
