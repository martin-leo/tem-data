#!/usr/bin/env bash

# modules node
npm install

# d3.js
curl -LkS 'https://raw.githubusercontent.com/mbostock/d3/master/d3.min.js' -o d3.js
curl -LkS 'http://marvl.infotech.monash.edu/webcola/cola.v3.min.js' -o cola.js
mkdir site
mv d3.js site
mv cola.js site

# génération du css/copie des fichiers dans /site
grunt gen
