#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

cd ~/dojo/js/hexjs
rm -rf 20200731
mkdir 20200731
cp -r ~/dojo/js/hexjs-final-management/dist/. ./20200731/

git add .
git commit -m "Deploy 20200731"
git push
