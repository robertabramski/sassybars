let fs = require('fs');
let bulbo = require('bulbo');
let data = require('gulp-data');
let sass = require('gulp-sass');
let rename = require('gulp-rename');
let bundler = require('bundle-through');
let handlebars = require('gulp-compile-handlebars');

bulbo.asset('./src/styles/*.scss')
  .watch('./src/styles/*.scss')
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(rename('style.css'));

bulbo.asset('./src/scripts/index.js')
  .watch('./src/scripts/*.js')
  .pipe(bundler())
  .pipe(rename('script.js'));

bulbo.asset('./src/pages/*.html')
  .watch('./src/pages/*.html', './src/partials/*.html', './src/data.json')
  .pipe(data(file => {
    return JSON.parse(fs.readFileSync('./src/data.json').toString());
  }))
  .pipe(handlebars(null, {
    batch: ['./src/partials']
  }));

bulbo.dest('dist');
bulbo.port(8080);
