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

  `/submit`

- **Method:**

  `GET`

- **URL Params**

  None

- **Success Response:**

  **Code:** 200

### Get a list of published questionnaires

Returns abstracted information about the latest version of published questionnaires within the registry. 

- **URL**

  `/published-questionnaires`

- **Method:**

  `GET`

- **URL Params**

  None
  
- **Query Params**

  None
  
- **Body Params**

  None

- **Success Response:**

  **Code:** 200 <br/>
  **Content:**
  
    ```
      [
        {
            "registry_id": "b02f1331-57f3-4427-8182-c969dbed6414",
            "survey_id": "187",
            "form_type": "002",
            "title": "Ecommerce",
            "lastPublished": "2019-12-12T08:55:27.731Z",
            "survey_version": "1"
        },
        {
            "registry_id": "8ab3974e-16c3-41ab-ac94-6f1d096fbf63",
            "survey_id": "187",
            "form_type": "0001",
            "title": "Ecommerce",
            "lastPublished": "2019-12-12T08:55:27.722Z",
            "survey_version": "1"
        }
    ]
    ```

- **Fail Response:**
  
  **Code:** 404 <br/>
  **Content:**
    ```
      Sorry, there are no published questionnaires
    ```

### Get the latest version of a questionnaire

Gets the latest version of a survey

- **URL**

  `/questionnaire`

- **Method:**

  `GET`

- **URL Params**

  None
  
- **Query Params**

  None
  
- **Body Params**

  ```
  {
    "survey_id": <STRING>,
    "form_type": <STRING>
  }
  ```

- **Success Response:**

  **Code:** 200 <br />
  **Content:** Runner JSON; examples: https://github.com/ONSdigital/eq-survey-runner/tree/master/data/en
  
- **Fail Response:**
  
  **Code:** 404 <br/>
  **Content:**
    ```
      Sorry, that questionnaire does not exist or is unavailable.
    ```
  
### Get a version of a questionnaire

Gets the registry entry for a given questionnaire at a given version.

- **URL**

  `/questionnaire/version`

- **Method:**

  `GET`

- **URL Params**

  None
  
- **Query Params**

  None
  
- **Body Params**

  ```
  {
    "survey_id": <STRING>,
    "form_type": <STRING>,
    "survey_version": <STRING>
  }
  ```

- **Success Response:**

  **Code:** 200 <br />
  **Content:** Runner JSON; examples: https://github.com/ONSdigital/eq-survey-runner/tree/master/data/en
  
- **Fail Response:**
  
  **Code:** 404 <br/>
  **Content:**
    ```
      Sorry, that questionnaire does not exist or is unavailable.
    ```
