### eq-survey-register

This service acts as a register of surveys

A REST API is exposed whith the following endpoints

Endpoint                                   | Description
-------------------------------------------|----------------------
`/`                                        | Returns a list of the available Schemas
`/{languageCode}/{schemaName}`             | Returns the Schema content for the specified language

---


#### Build and Run
```
go get -d github.com/ONSdigital/eq-survey-register/
cd $GOPATH/src/github.com/ONSdigital/eq-survey-register/
go get -u github.com/golang/dep/cmd/dep
dep ensure
go build
./eq-survey-register
```