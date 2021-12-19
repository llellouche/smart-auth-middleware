# Smart Auth Middleware

# Install

Run `npm install`

## Development server

Run `node index.js` for a dev server. App is available on `http://localhost:8080/`.

## Build with Docker
Build and run middleware `docker compose up -d`. App is available on `http://localhost:8080/`.

# Features

* Register users
* Authenticate users
* Secured api access with Auth token
* Secured article edition, only article owner and ADMIN role can update one article

# Technical points
* Layers are separated, Routes, Controllers and Database services
* Other routes (not handled by middleware) are secured by 2 different proxyReqPathResolver
