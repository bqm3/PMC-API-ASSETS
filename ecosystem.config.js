

module.exports = {
    apps: [
        {
            name: "PMC ASSETS",
            script: "./index.js",
            env: {
                NODE_ENV: 'production',
                PORT: 8888
            }
        }
    ]
}