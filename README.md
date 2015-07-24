# README

[![Build Status](https://travis-ci.org/Vizzuality/gfw-climate.svg?branch=master)](https://travis-ci.org/Vizzuality/gfw-climate) [![Code Climate](https://codeclimate.com/github/Vizzuality/gfw-climate/badges/gpa.svg)](https://codeclimate.com/github/Vizzuality/gfw-climate)

## Requirements

  - **Ruby version:** mri 2.2.2

## SETUP

Just execute the script file in bin/setup

  - Depends on gfwc [repository](https://github.com/Vizzuality/gfw-climate)
  - create .env with:

```
GFW_API_HOST=gfw-apis.appspot.com
TERMS_COOKIE=cookie_terms
```

## TEST

  - Run rspec:

    bin/rspec

  - Run teaspoon

    rake teaspoon

## DEPLOYMENT

### Heroku
