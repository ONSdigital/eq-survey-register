#!/bin/bash
set -e

AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy
FIRESTORE_PROJECT_ID=dummy-project-id
FIRESTORE_PORT=8080
SURVEY_REGISTER_URL=http://host.docker.internal:8080
GO_QUICK_LAUNCHER_URL=http://localhost:8000/quick-launch?url=
PUBLISHER_URL=http://host.docker.internal:9000/publish/

echo "starting docker..."

FIRESTORE_CONTAINER_ID=$(docker run -tid -P -e FIRESTORE_PROJECT_ID=$FIRESTORE_PROJECT_ID -e PORT=$FIRESTORE_PORT mtlynch/firestore-emulator-docker)
DYNAMO_CONTAINER_ID=$(docker run -tid -P -e AWS_REGION=$AWS_REGION -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY amazon/dynamodb-local)
FIRESTORE_HOST=$(docker port $FIRESTORE_CONTAINER_ID 8080)
DYNAMO_HOST=$(docker port $DYNAMO_CONTAINER_ID 8000)

echo "dynamo started at: $DYNAMO_HOST"
echo "firestore started at: $FIRESTORE_HOST"

function finish {
  echo "killing docker..."
  docker rm -vf $FIRESTORE_CONTAINER_ID
  docker rm -vf $DYNAMO_CONTAINER_ID
}
trap finish EXIT

echo "waiting on Dynamo to start..."

./node_modules/.bin/wait-on http://$DYNAMO_HOST/shell
#./node_modules/.bin/wait-on http://$FIRESTORE_HOST

echo "firestore host : http://${FIRESTORE_HOST}"
echo "dynamo host : http://${DYNAMO_HOST}"
echo "running tests..."

AWS_REGION=${AWS_REGION} \
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
NODE_ENV=development \
SURVEY_REGISTER_URL=${SURVEY_REGISTER_URL} \
GO_QUICK_LAUNCHER_URL=${GO_QUICK_LAUNCHER_URL} \
PUBLISHER_URL=${PUBLISHER_URL} \
DYNAMODB_ENDPOINT_OVERRIDE=http://${DYNAMO_HOST} \
yarn jest --runInBand --detectOpenHandles --forceExit "$@"

