package main

import (
	"testing"
	"net/http"
	"net/http/httptest"
	"strings"
	"io"
)

func TestListSchemas(t *testing.T) {
	rr, err := makeRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check the response body is what we expect.
	expected := `{"_links":{"self":{"href":"http:///"}},"_embedded":{"schemas":[`
	if !strings.Contains(rr.Body.String(), expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}
}

func TestGetSchema(t *testing.T) {
	rr, err := makeRequest("GET", "/test_register", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check the response body is what we expect.
	expected := `"title": "English Register Survey",`
	if !strings.Contains(rr.Body.String(), expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}
}

func TestGetSchema_with_language_query_string(t *testing.T) {
	rr, err := makeRequest("GET", "/test_register?language=cy", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check the response body is what we expect.
	expected := `"title": "Welsh Register Survey",`
	if !strings.Contains(rr.Body.String(), expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}
}

func TestGetSchema_with_invalid_name(t *testing.T) {
	rr, err := makeRequest("GET", "/i_dont_exist", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusNotFound  {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
}

func makeRequest(method, urlStr string, body io.Reader) (recorder *httptest.ResponseRecorder, e error) {
	// Create a request to pass to our handler.
	req, err := http.NewRequest(method, urlStr, body)
	if err != nil {
		return nil, err
	}

	// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	rr := httptest.NewRecorder()

	// Our handlers satisfy http.Handler, so we can call their ServeHTTP method
	// directly and pass in our Request and ResponseRecorder.
	Router().ServeHTTP(rr, req)

	return rr, nil
}