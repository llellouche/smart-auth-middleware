const { Pool } = require("pg");
const database = {}


database.connect = async () => {
    const pool = new Pool({
        user: "api-platform",
        host: "localhost",
        database: "api",
        password: "!ChangeMe!",
        port: '5432'
    });

    console.log(pool);
    database.db = pool;
}

module.exports = database
