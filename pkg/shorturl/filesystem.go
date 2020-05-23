package main

import (
	"strconv"
	"errors"
)

type Filesystem struct {
	cache map[string]string
}

func (s *Filesystem) Init() {
	s.cache = make(map[string]string)
}

func (s *Filesystem) Code() string {
	filesLen := len(s.cache)
	return strconv.FormatUint(uint64(filesLen+1), 36)
}

func (s *Filesystem) Save(url string) string {
	code := s.Code()
	s.cache[code] = url 
	return code
}

func (s *Filesystem) Load(code string) (string, error) {
	if(s.cache[code] != "") {
		return s.cache[code], nil
	}
	return "", errors.New("not found")
}
