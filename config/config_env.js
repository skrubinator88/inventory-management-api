let config = {
    development: {
        url: "",
        jwt_secret: 'random_secret',
        //MySQL database info
        database: {
            host: "127.0.0.1",
            port: 5432,
            db_name: "tenaciti_test",
            username: "emen",
            password: "Oseriemen20",
            dialect: "postgresql"
        },
        redisStore: {
            url: "miscellaneous",
            secret: "tommy"
        },
        server: {
            host: "127.0.0.1",
            port: 3001
        }
    },
    production: {
        jwt_secret: 'random_secret',
        database: {
            host: "127.0.0.1",
            port: 5432,
            db_name: "tenaciti",
            username: "ivbazetech",
            password: "Oseriemen20",
            dialect: "postgresql"
        },
        server: {
            host: "127.0.0.1",
            port: 3001
        }
    }
};
module.exports = config;