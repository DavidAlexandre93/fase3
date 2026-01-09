module.exports = {
    transform: {
        "^.+\\.m?js$": ["babel-jest", { configFile: "./babel.config.cjs" }]
    },
    testEnvironment: "node"
};
