package main // import "github.com/ONSdigital/eq-survey-register"

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"html"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"github.com/AreaHQ/jsonhal"
	"go.uber.org/zap"
	"os"
)

var logger, _ = zap.NewProduction()

func main() {

	defer logger.Sync()

	logger.Info("Survey Register Started",
		zap.String("port", "8080"),
	)

	log.Fatal(http.ListenAndServe(":8080", Router()))
}

// Router defines the route mapping for the API
func Router() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", ListSchemas)
	router.HandleFunc("/{schemaName}", GetSchema)
	return router
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
		var filename = f.Name()[0:len(f.Name())-len(extension)]

		schema := Schema{Name: filename}
		schema.SetLink("self", fmt.Sprintf("%s://%s/%s",
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
	Name  string `json:"name"`
}