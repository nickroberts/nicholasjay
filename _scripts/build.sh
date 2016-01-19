#!/bin/bash

if [ "$TRAVIS_BRANCH" == "master" ]; then
  gulp build --config=dev
elif [ "$TRAVIS_TAG" ]; then
  gulp build --config=prod
else
  gulp build
fi
