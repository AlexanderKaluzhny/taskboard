#!/usr/bin/env bash
# https://fractalideas.com/blog/making-react-and-django-play-well-together-hybrid-app-model/#fnref-1

npm run build

mkdir -p build/root
for file in $(ls build | grep -E -v '^(index\.html|static|root)$'); do
    mv "build/$file" build/root;
done