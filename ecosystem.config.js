const dotenv = require('dotenv');

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    apps: [
        {
            script: isProd ? 'yarn start' : './',
            name: 'svd-editor',
            max_restarts: 2,
            restart_delay: 2000,
        },
    ],
};
