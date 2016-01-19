#!/bin/bash

cd _site

if [ "$TRAVIS_BRANCH" == "master" ]; then
  git config --global user.name "Travis CI"
  git config --global user.email "djparadyme@gmail.com"
  git init
  git add .
  git commit -m "Deploy"
  git push --force --quiet "https://${git_user}:${git_password}@${git_target}" master:gh-pages > /dev/null 2>&1
elif [ "$TRAVIS_TAG" ]; then
  gulp deploy:prod --hostname=${prod_url} --directory=${prod_dir} --user=${prod_username} --password=${prod_password}
fi
