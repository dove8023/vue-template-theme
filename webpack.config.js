const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: "development",
    target: "web",
    entry: "./src/main.js",
    output: {
        path: path.resolve("./dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.vue$/,
            include: [
                path.resolve("./src"),
            ],
            use: {
                loader: "vue-loader"
            }
        }, {
            test: /\.css$/,
            include: [
                path.resolve(__dirname, "./src")
            ],
            use: [
                {
                    loader: "file-loader",
                    options: {
                        name: "assets/[name].css",
                    },
                },
                {
                    loader: "extract-loader",
                    options: {
                        publicPath: "./dist/css",
                    }
                },
                {
                    loader: "css-loader"
                }
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),

        new VueLoaderPlugin(),

    ]
}