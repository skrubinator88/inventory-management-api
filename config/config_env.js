let config = {
    development: {
        url: "",
        stripe: {
            publishable_key: 'pk_test_lBIB5BqfHoM4zbnte92tXRHP',
            secret_key: 'sk_test_F2PuN5RhgQcJzk8vnOzQKmdg',
            client_id: 'ca_DnDEKLGCeF2zZG1qpKFlFIqWvvj0sS10',
            authorizeUri: 'https://connect.stripe.com/express/oauth/authorize',
            tokenUri: 'https://connect.stripe.com/oauth/token',
            redirect_uri: 'https://tenacitiportal.com/setup-payment-complete'
        },
        jwt_secret: 'random_secret',
        //MySQL database info
        database: {
            host: "127.0.0.1",
            port: 5432,
            db_name: "tenaciti_test",
            username: "emen",
            password: "Oseriemen20",
            dialect: "postgresql",
            pool: {
                max: 100,
                min: 1,
                acquire: 20000,
                idle: 20000,
                evictionRunIntervalMillis: 5,
                softIdleTimeoutMillis: 5
            }
        },
        redisStore: {
            "user": "",
            "password": "",
            "host": "",
            "port": 6379
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
        stripe: {
            publishable_key: 'pk_test_lBIB5BqfHoM4zbnte92tXRHP',
            secret_key: 'sk_test_F2PuN5RhgQcJzk8vnOzQKmdg',
            client_id: 'ca_DnDEKLGCeF2zZG1qpKFlFIqWvvj0sS10',
            authorizeUri: 'https://connect.stripe.com/express/oauth/authorize',
            tokenUri: 'https://connect.stripe.com/oauth/token',
            redirect_uri: 'https://tenacitiportal.com/setup-payment-complete'
        },
        server: {
            host: "127.0.0.1",
            port: 3001
        }
    }
};
module.exports = config;