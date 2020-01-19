#!/bin/bash
set -e

AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy
DYNAMO_QUESTIONNAIRE_TABLE_NAME=test-author-questionnaires
DYNAMO_QUESTIONNAIRE_VERSION_TABLE_NAME=test-author-questionnaire-versions
DYNAMO_COMMENTS_TABLE_NAME=test-author-comments
DYNAMO_USER_TABLE_NAME=test-author-users
FIREBASE_PROJECT_ID=test-firebase-id
SURVEY_REGISTER_URL=http://host.docker.internal:8080
GO_QUICK_LAUNCHER_URL=http://localhost:8000/quick-launch?url=
PUBLISHER_URL=http://host.docker.internal:9000/publish/

echo "starting Dynamo docker..."

DYNAMO_CONTAINER_ID=$(docker run -tid -P -e AWS_REGION=$AWS_REGION -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY amazon/dynamodb-local)
DYNAMO_HOST=$(docker port $DYNAMO_CONTAINER_ID 8000)

echo "dynamo started at: $DYNAMO_HOST"

function finish {
  echo "killing docker..."
  docker rm -vf $DYNAMO_CONTAINER_ID
}
trap finish EXIT

echo "waiting on Dynamo to start..."

./node_modules/.bin/wait-on http://$DYNAMO_HOST/shell

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

