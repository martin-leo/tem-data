#!/usr/bin/env bash

# modules node
npm install

# d3.js
curl -LkS 'https://raw.githubusercontent.com/mbostock/d3/master/d3.min.js' -o d3.js
mkdir site
mv d3.js site

# génération du css/copie des fichiers dans /site
grunt gen
