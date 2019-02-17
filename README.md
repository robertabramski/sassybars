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

During development, a live reload server can be run to host the files locally. To start the server run `npm start` or `npm run server`. Then, navigate the browser to `http://localhost:8080`. The port can be reconfigured in the `sassybars.json`.

## File Structure

The file structure has been setup for ease of use, not scalability. This framework was created with the intention of being a basic boilerplate for simple sites consisting of a few static pages. By default, the framework does not recursively search directories. This can be modified with glob strings if needed for further organization of directories. If globs are modified consider a few points. Automatic partial registration only takes the file name into account, not the directory it exists in, so partial sub directories file names have to be unique as if the directory was flat. Page sub directories will copy over their directories when compiled, breaking links unless taken into consideration.
 
## Conventions

All script and style files should be required into the main index files for inclusion into the final payloads. It is presumed that all  partials are uniquely named so there will be no naming collisions.

## About the Data File

The `src/data.json` contains all the data that will be output. There are two types of data, global and page specific. Global data, lives at the top level of the JSON file. Global data will be overridden by page data if a page level property has the same name as a global property. Page specific data should be an object and the property name should be the same name as the page file name in the pages directory.

## About the Config File

The `sassybars.json` contains basic configurable information about the application. By default, Sassybars does not recursively search directories. This can be changed by editing the glob strings. Directory names can also be changed with the glob strings. Keep in mind, if the partials directory is made recursive, the partial name will be the name of the file without the directory. Unexpected results may occur if more than one partial has the same file name.

## Production

To create the static site production bundle, run `npm run build` for a clean build. To minify all files, set the `NODE_ENV` to `production` and run `npm run build`.
