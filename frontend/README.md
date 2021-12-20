### Clone
```bash
   git clone https://bitbucket.org/khaleel/supplieson_front-end
```
### Project Structure
  this project structured  be future (admin, customer, supplier)
  inside app folder there are three main module:

  1- admin module
  2- customer module
  3- suppler module

  this three module imported as dependency injection modules in main module (app Module)
  + there are two shared module auth module and services module (for all services).

### Install Dependencies
```bash
   npm install
```

### Setup for Development
```bash
   npm install webpack -g
   npm i -g eslint eslint-watch
   npm install -g yarn
   
```
To watch for changes and compile
```bash
  webpack --watch
  or npm start
```

The main script file is build/js/app.min.js everything (services, controllers, etc.);

### Run
```bash
   gulp server
```
## minify css
gulp styles

