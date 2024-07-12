#!/bin/bash
rm -rf ../exampleDist
vite build -c vercelVite.config.js
cp -r example/exampleDist ../exampleDist
git checkout buildGithub
#rm -rf ./
cp -r ../exampleDist/* ./
git add .
git commit -m"update"
git push
git checkout main
