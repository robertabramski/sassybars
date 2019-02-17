# Sassybars

A static site generator using [Sass](http://sass-lang.com/) and [Handlebars](http://handlebarsjs.com/).

## Requirements

All dependencies can be installed with `npm install`.

## Usage

This is a boilerplate repo. The best way to use it is to download the ZIP file directly and modify it directly to whatever suits the project. For pro users, the following command will pull the repo (into the current working directory) and remove version tracking.

```
git clone --depth=1 --branch=master git@github.com:robertabramski/sassybars.git . && rm -rf ./.git
```

## Development

During development, a live reload server can be run to host the files locally. To start the server run `npm start` or `npm run server`. Then, navigate the browser to `http://localhost:8080`. The port can be reconfigured in the `bulbofile.js`.

## About the Data File

The `data.json` contains all the data that will be output. There are two types of data, global and page specific. Global data, lives at the top level of the JSON file. Global data will be overridden by page data if a page level property has the same name as a global property. Page specific data should be an object and the property name should be the same name as the page file name in the pages directory.

## Production

To create the static site production bundle, run `npm run build` for a clean build. To minify all files, set the `NODE_ENV` to `production` and run `npm run build`.
