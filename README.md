# eq-survey-register

This service acts as a register of surveys published from the eq-author service.

## Build and Run

Dependencies in this project are managed by yarn. To install all required packages run:

`yarn install`

In order to run this service locally the docker compose file contains all the necessary configuration. Start it using:

`docker-compose up` (passing in the --build flag if first time setup)

## API Reference

### Submit

Publishes the Author survey with the given questionnaire Id and stores it into the registry.

- **URL**

  `/submit/:questionnaireId/:surveyId/:formType`

- **Method:**

  `GET`

- **URL Params**

  None

- **Success Response:**

  **Code:** 200

### AllSurveys

Gets information about the surveys that are stored within the registry.

- **URL**

  `/allsurveys`

- **Method:**

  `GET`

- **URL Params**

  None

- **Success Response:**

  **Code:** 200 <br />
  **Content:**

  ```
  [ { title: "Google Pixel 4",
      date_published: "1574776786750",
      register_id: "b391dacf-cff6-4f57-9ca1-917ad4fd0a33",
      eq_id: "f5489168-f6fa-4c9e-8404-99d0a0e3d805",
      survey_id: "123",
      form_type: "123",
      versions: 11
    },
    { title: "iPhone 11",
      date_published: "1574776884072",
      register_id: "249feb68-8d56-44d9-ac91-1a36137adcd0",
      eq_id: "e7602122-6d6d-4678-80df-c6ffa544179f",
      survey_id: "123",
      form_type: "123",
      versions: 4
    }
  ]
  ```

### Get version of a survey

Gets the registry entry for a given questionnaire at a given version.

- **URL**

  `/surveys/:eqId/versions/:version`

- **Method:**

  `GET`

- **URL Params**

  **Required** `eqId` -> The id of a survey from Author; the EQ id <br/>
  **Required** `version` -> The desired version of the survey to return

- **Success Response:**

  **Code:** 200 <br />
  **Content:**

  ```
  {
    survey_id: "123",
    survey_version: 11,
    date_published: ""1574776786750",
    survey: {
      . . . AUTHOR JSON . . .
    },
    eq_id: "f5489168-f6fa-4c9e-8404-99d0a0e3d805",
    id: "b391dacf-cff6-4f57-9ca1-917ad4fd0a33",
    form_type: "123"
  }
  ```
