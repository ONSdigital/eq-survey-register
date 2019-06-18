package main // import "github.com/ONSdigital/eq-survey-register"

import (
	"encoding/json"
	"fmt"
	"html"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/AreaHQ/jsonhal"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

var logger, _ = zap.NewProduction()

func main() {

	defer logger.Sync()

	logger.Info("Survey Register Started",
		zap.String("port", "9090"),
	)

	log.Fatal(http.ListenAndServe(":9090", Router()))
}

// Router defines the route mapping for the API
func Router() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", ListSchemas)
	router.HandleFunc("/savequestionnaire", SaveQuestionnaireToFile)
	router.HandleFunc("/viewquestionnaire/{schemaName}", GetSchema)
	return router
}

// SaveQuestionnaireToFile saves the json to a file.
func SaveQuestionnaireToFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	type Questionnaire struct {
		EqID      string `json:"eq_id"`
		UpdatedAt string `json:"updatedAt"`
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	jsonString := string(body)
	var questionnaire Questionnaire
	json.Unmarshal([]byte(jsonString), &questionnaire)
	if questionnaire.EqID == "" || questionnaire.UpdatedAt == "" {
		fmt.Println("No eq_id or updatedAt provided in json. Or the schema was not validated.")
		return
	}

	fileName := questionnaire.EqID + "-v" + questionnaire.UpdatedAt + ".json"
	f, err := os.Create("data/en/" + fileName)
	if err != nil {
		fmt.Println(err)
	}
	bytesWritten, err := f.WriteString(jsonString)
	f.Close()
	fmt.Printf("Wrote %d bytes to file %s\n", bytesWritten, fileName)

}

// ListSchemas lists the available Schemas
func ListSchemas(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	forwardedProtocol := r.Header.Get("X-Forwarded-Proto")

	requestProtocol := "http"

	if forwardedProtocol != "" {
		requestProtocol = forwardedProtocol
	}

	schemas := Schemas{}

	files, _ := ioutil.ReadDir("./data/en")
	for _, f := range files {
		extension := filepath.Ext(f.Name())
		if extension != ".json" {
			continue
		}
		var filename = f.Name()[0 : len(f.Name())-len(extension)]

		schema := Schema{Name: filename}
		schema.SetLink("self", fmt.Sprintf("%s://%s/viewquestionnaire/%s",
			requestProtocol,
			html.EscapeString(r.Host),
			filename), "")
		schemas = append(schemas, schema)
	}

	response := struct {
		jsonhal.Hal
	}{}

	response.SetLink("self", fmt.Sprintf("%s://%s/", requestProtocol, html.EscapeString(r.Host)), "")
	response.SetEmbedded("schemas", schemas)

	strResponse, _ := json.Marshal(response)

	fmt.Fprintf(w, string(strResponse))
}

// GetSchema gets the json schema
func GetSchema(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	schemaName := vars["schemaName"]

	languageCode := r.URL.Query().Get("language")

	language := "en"

	if languageCode != "" {
		language = languageCode
	}

	var file []byte

	if _, err := os.Stat(fmt.Sprintf("%s.json", filepath.Join("./data/", language, schemaName))); !os.IsNotExist(err) {
		file = LoadSchemaFile(schemaName, language)
	} else {
		file = LoadSchemaFile(schemaName, "en")
	}

	if file == nil {
		w.WriteHeader(http.StatusNotFound)
	}

	w.Write(file)
}

// LoadSchemaFile Loads the Schema file for the supplied language
func LoadSchemaFile(schemaName string, language string) []byte {
	filename := filepath.Join("./data/", language, schemaName)

	logger.Info("Loading Schema",
		zap.String("schema", filename),
	)

	file, err := ioutil.ReadFile(fmt.Sprintf("%s.json", filename))

	if err != nil {
		logger.Error("Failed Loading Schema",
			zap.String("schema", filename),
		)

		return nil
	}

	return file
}

// Schemas is a list of Schema
type Schemas []Schema

// Schema is an available schema
type Schema struct {
	jsonhal.Hal
	Name string `json:"name"`
}
