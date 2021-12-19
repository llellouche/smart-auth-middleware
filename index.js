const express = require('express')
const routes = require('./routes')
const database = require('./database')
const proxy = require('express-http-proxy');
const userAuth = require("./Model/user-auth");
const Response = require('isomorphic-fetch');
// const cors = require("cors");

const db = Promise.resolve(database.connect())

const app = express();
app.use(express.json());
// app.use(cors());
app.use(routes);

// Redirect Other Routes To Doctrina API
// If Token is not valid Http 401 is returned
app.use('/articles*', proxy('localhost', {
    proxyReqPathResolver: function (req, res) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {   // do asyncness
                if (req.method == 'PUT') {
                    let articleId = req.originalUrl.replace('/articles/', '');
                    console.log(articleId);
                    return userAuth.canUpdateArticle(req.headers.authorization, articleId).then((isValid) => {
                        console.log(req.originalUrl);
                        console.log(req.method);

                        if (isValid) {
                            resolve(req.originalUrl);
                        }

                        req.status = 401;
                        req.body = '{}';
                        req.headers['Content-Type'] = 'application/json';
                        reject(req);
                    });
                } else if(req.method == 'GET') {
                    // Intercept GET query with path Articles for display only published
                    if (req.originalUrl == '/articles' ) {
                        resolve(req.originalUrl + '?draft=false');
                    } else if(req.originalUrl.startsWith('/articles?')) {
                        resolve(req.originalUrl + '&draft=false');
                    } else {
                        resolve(req.originalUrl);
                    }
                } else  {
                    resolve(req.originalUrl);
                }
            }, 200);
        });

        return res;
    }
}));

// Redirect Other Routes To Doctrina API
// If Token is not valid Http 401 is returned
app.use('/*', proxy('localhost', {
    proxyReqPathResolver: function (req, res) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {   // do asyncness
                return userAuth.isValidToken(req.headers.authorization).then((isValid) => {
                    if (isValid) {
                        resolve(req.originalUrl);
                    }

                    console.log(req.originalUrl);
                    console.log(req.method);

                    req.status = 401;
                    req.body = '{}';
                    req.headers['Content-Type'] = 'application/json';
                    reject(req);
                });
            }, 200);
        });

        return res;
    }
}));

app.listen(8080, () => {
    console.log("Serveur à l'écoute")
})
