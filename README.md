# Sassybars

A static site generator using [Sass](http://sass-lang.com/) and [Handlebars](http://handlebarsjs.com/).

## Requirements

To run the commands, Bulbo must be installed globally. Run `npm install -g bulbo` to install. All other dependencies can be installed with `npm install`.

## Usage

This is a boilerplate repo. The best way to use it is to download the ZIP file directly and modify it directly to whatever suits the project. For pro users, the following command will pull the repo (into the current working directory) and remove version tracking.

```
git clone --depth=1 --branch=master git@github.com:robertabramski/sassybars.git . && rm -rf ./.git
```

## Development

During development, a server can be run to host the files locally. To start the server run `npm start` or `npm run server`. Then, navigate the browser to `http://localhost:8080`. The port can be reconfigured in the `bulbofile.js`.

## Production

To create the static site production bundle, run `npm run build` for a clean build. Running `bulbo build` will also create a build, but without cleaning the `dist` directory.