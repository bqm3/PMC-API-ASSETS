

module.exports = {
    apps: [
        {
            name: "api-assets",
            script: "./index.js",
            env: {
                NODE_ENV: 'production',
                PORT: 8888
            }
        }
    ]
}