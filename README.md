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

## File Structure

TODO

## Conventions

TODO

## About the Data File

The `src/data.json` contains all the data that will be output. There are two types of data, global and page specific. Global data, lives at the top level of the JSON file. Global data will be overridden by page data if a page level property has the same name as a global property. Page specific data should be an object and the property name should be the same name as the page file name in the pages directory.

## About the Config File

The `sassybars.json` contains basic configurable information about the application. By default, Sassybars does not recursively search directories. This can be changed by editing the glob strings. Directory names can also be changed with the glob strings. Keep in mind, if the partials directory is made recursive, the partial name will be the name of the file without the directory. Unexpected results may occur if more than one partial has the same file name. It is recommended to use partial directories for organization not modularity. Also, note if `OUTPUT_DIRECTORY` is changed, the `npm run clean` will need to be updated to the correct directory name to work.

## Production

To create the static site production bundle, run `npm run build` for a clean build. To minify all files, set the `NODE_ENV` to `production` and run `npm run build`.
