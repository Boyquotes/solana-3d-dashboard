#!/bin/bash

vite build -c vercelVite.config.js
cp -r example/exampleDist ../exampleDist
git checkout buildGithub
#rm -rf ./
cp -r ../exampleDist/* ./
git checkout main
