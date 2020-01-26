#!/bin/bash
set -e

AWS_REGION=eu-west-1 \
AWS_ACCESS_KEY_ID=dummy \
AWS_SECRET_ACCESS_KEY=dummy \
NODE_ENV=development \
PUBLISHER_URL=ttp://localhost:9000/publish/ \
DYNAMODB_ENDPOINT_OVERRIDE=http://dynamo:8000 \
FIRESTORE_EMULATOR_HOST=firestore:8080 \
FIRESTORE_PROJECT_ID=test-project \
yarn jest --runInBand --detectOpenHandles --forceExit "$@"

