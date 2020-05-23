package main

// Package storages allows multiple implementation on how to store short URLs.
type IStorage interface {
	Code() string
	Save(string) string
	Load(string) (string, error)
}
