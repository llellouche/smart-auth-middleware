const connection = require('../database')
const md5 = require('md5');
const {use} = require("express/lib/router");

const userAuth = {}

userAuth.list = async function () {
    return connection.db.query("SELECT id, email, username, created_at, created_at, updated_at, auth_token FROM users")
        .then(res => res.rows)
        .catch(err => console.error('Error executing query', err.stack))
}

userAuth.register = async function (email, username, password) {
    if (! email || ! username || ! password) {
        return;
    }

    let hash = md5(password);
    const query = {
        text: 'INSERT INTO users(email, username, password, created_at) VALUES($1, $2, $3, $4)',
        values: [email, username, hash, new Date()],
    }

    await connection.db.query(query);

    // Auth User
    return userAuth.login(email, password);
}

userAuth.login = async function (email, password) {
    if (! email || ! password) {
        return;
    }

    let hash = md5(password);
    const query = {
        text: 'SELECT id, email, username, created_at, created_at, updated_at, auth_token FROM users WHERE email = $1 AND password = $2',
        values: [email, hash],
    }

    let result = await connection.db.query(query);
    if (result.rows.length === 0) {
        return;
    }

    let user = result.rows[0];
    if (user?.auth_token === undefined || user?.auth_token === null) {
        let auth_token = await userAuth.insertAuthToken(email);
        user.auth_token = auth_token;

        return user;
    }

    return user;
}

userAuth.insertAuthToken = async function (email, password) {
    let hash = md5((Math.random() + 1).toString(36).substring(7));
    const query = {
        text: 'UPDATE users SET auth_token = $1 WHERE email = $2',
        values: [hash, email],
    }
    return connection.db.query(query)
        .then(res => {

            return hash
        }).catch(err => console.error('Error executing query', err.stack))
}

userAuth.isValidToken = async function (token) {
    const query = {
        text: 'SELECT auth_token FROM users WHERE auth_token = $1',
        values: [token],
    }
    return connection.db.query(query)
        .then((res) => {
            return res.rows.length > 0;
        }).catch(err => console.error('Error executing query', err.stack))
}

userAuth.canUpdateArticle = async function (token, articleId) {
    const query = {
        text: 'SELECT id, role FROM users WHERE auth_token = $1',
        values: [token],
    }

    let result = await connection.db.query(query);
    if (result.rows.length === 0) {
        return;
    }

    let user = result.rows[0];

    if (user.role === 'ROLE_ADMIN') {
        return true;
    }

    let userId = user.id;
    const queryArticle = {
        text: 'SELECT id FROM article WHERE article.id = $1 AND article.author_id = $2',
        values: [articleId, userId],
    }

    let resultArticle = await connection.db.query(queryArticle);
    if (resultArticle.rows.length === 0) {
        return false;
    }

    console.log('Can update :');
    console.log('Article' + articleId);
    console.log('User' + userId);
    return true;
}

module.exports = userAuth
