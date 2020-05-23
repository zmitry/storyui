package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	storage := &Filesystem{}
	storage.Init()
	http.HandleFunc("/", EncodeHandler(storage))
	http.HandleFunc("/dec/", DecodeHandler(storage))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err:=http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
