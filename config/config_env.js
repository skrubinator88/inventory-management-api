let config = {
    development: {
        url: "127.0.0.1:8080",
        ios_settings: {
            bundleId: "com.tenaciti-Inc.tenaciti"
        },
        transporter: {
            host: 'smtp.zoho.com',
            port: '465',
            secure: true,
            auth: {
                user:'support@tenaciti.co',
                pass:'Sartup1!'
            }
        },
        stripe: {
            publishable_key: 'pk_test_lBIB5BqfHoM4zbnte92tXRHP',
            secret_key: 'sk_test_F2PuN5RhgQcJzk8vnOzQKmdg',
            client_id: 'ca_DnDEKLGCeF2zZG1qpKFlFIqWvvj0sS10',
            authorizeUri: 'https://connect.stripe.com/express/oauth/authorize',
            tokenUri: 'https://connect.stripe.com/oauth/token',
            redirect_uri: 'http://127.0.0.1:8080/setup-payment-complete'
        },
        apn_options: {
            token: {
                key: "certificate.p8",
                keyId: "RND29M346W",
                teamId: "8L2DXL23X9"
            },
            production: false
        },
        jwt_secret: 'random_secret',
        jwt_confirm_email:'confirm_email',
        jwt_password_reset:'reset_your_password',
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
            "host": "127.0.0.1",
            "port": 6379
        },
        server: {
            host: "127.0.0.1",
            port: 3001
        }
    },
    production: {
        url:'tenacitiportal.com',
        jwt_secret: 'random_secret',
        jwt_confirm_email:'confirm_email',
        jwt_password_reset:'reset_your_password',
        transporter: {
            host: 'smtp.zoho.com',
            port: '465',
            secure: true,
            auth: {
                user:'support@tenaciti.co',
                pass:'Sartup1!'
            }
        },
        database: {
            host: "127.0.0.1",
            port: 5432,
            db_name: "tenaciti",
            username: "ivbazetech",
            password: "Oseriemen20",
            dialect: "postgresql"
        },
        apn_options: {
            token: {
                key: "certificate.p8",
                keyId: "RND29M346W",
                teamId: "8L2DXL23X9"
            },
            production: true
        },
        stripe: {
            publishable_key: 'pk_test_lBIB5BqfHoM4zbnte92tXRHP',
            secret_key: 'sk_test_F2PuN5RhgQcJzk8vnOzQKmdg',
            client_id: 'ca_DnDEKLGCeF2zZG1qpKFlFIqWvvj0sS10',
            authorizeUri: 'https://connect.stripe.com/express/oauth/authorize',
            tokenUri: 'https://connect.stripe.com/oauth/token',
            redirect_uri: 'https://tenacitiportal.com/setup-payment-complete'
        },
        redisStore: {
            "user": "sbarge@tenaciti.co",
            "password": "pSWmVcpQxlxTmJkGHWG0lIi1stn3J4ET",
            "host": "redis-19684.c52.us-east-1-4.ec2.cloud.redislabs.com",
            "port": 19684
        },
        ios_settings: {
            bundleId: "com.tenaciti-Inc.tenaciti"
        },
        server: {
            host: "127.0.0.1",
            port: 3001
        }
    }
};
module.exports = config;