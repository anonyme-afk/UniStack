#!/bin/sh
# simple pre-commit hook: run tests
npm run test
RESULT=$?
if [ $RESULT -ne 0 ]; then
  echo "Pre-commit: tests failed, aborting commit."
  exit 1
fi
