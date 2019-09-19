### eq-survey-register

This service acts as a register of surveys published from the eq-author service.

A REST API is exposed with the following endpoints

| Endpoint                                       | Description                                                                                  |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `/submit/:questionnaireId/:surveyId/:formType` | Publishes the Author survey with the given questionnaire Id and stores it into the registry. |
| `/retrieve/:questionnaireId`                   | Returns the Schema content for the specified questionnaire Id                                |

---

#### Build and Run

Dependencies in this project are managed by yarn. To install all required packages run:

`yarn install`

In order to run this service locally the docker compose file contains all the necessary configuration. Start it using:

`docker-compose up` (passing in the --build flag if first time setup)
