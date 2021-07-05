const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");


module.exports = [{
    mode: "development",
    target: "web",
    entry: {
        blue: "./src/main.js",
    },
    output: {
        path: path.resolve("./dist"),
        filename: "[name].js"
    },
    optimization: {
        minimize: false
    },
    resolve: {
        extensions: [".ts", ".js", ".tsx"]
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
        },

        {
            test: /\.tsx?$/,
            include: [
                path.resolve("./src")
            ],
            use: [{
                loader: "ts-loader"
            }]
        },

        {
            test: /\.(s)?css$/,
            include: [
                path.resolve("./src")
            ],
            use: [
                // {
                //     loader: "file-loader",
                // },
                // {
                //     loader: "extract-loader",
                //     options: {
                //         publicPath: path.resolve("./dist/css"),
                //     }
                // },
                {
                    loader: MiniCssExtractPlugin.loader
                },
                {
                    loader: "css-loader"
                },
                {
                    loader: "sass-loader",
                    options: {
                        additionalData: `@import "./src/assets/theme/blue.scss";`,
                    }
                },
            ]
        },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            insert: function (linkTag) {
                console.log(123, linkTag);
            }
        }),
        new ModuleFederationPlugin({
            name: "HOST",
            filename: "remoteEntry.js",
            exposes: {
                exposeInit: "./src/main.js"
            },
            // shared: require("./package.json").dependencies,
        }),
    ]
},
    // {
    //     mode: "development",
    //     target: "web",
    //     entry: {
    //         red: "./src/main.js"
    //     },
    //     output: {
    //         path: path.resolve("./dist"),
    //         filename: "[name].js"
    //     },
    //     optimization: {
    //         minimize: false
    //     },
    //     module: {
    //         rules: [{
    //             test: /\.vue$/,
    //             include: [
    //                 path.resolve("./src"),
    //             ],
    //             use: {
    //                 loader: "vue-loader"
    //             }
    //         },

    //         {
    //             test: /\.(s)?css$/,
    //             include: [
    //                 path.resolve("./src")
    //             ],
    //             use: [
    //                 // {
    //                 //     loader: "file-loader",
    //                 // },
    //                 // {
    //                 //     loader: "extract-loader",
    //                 //     options: {
    //                 //         publicPath: path.resolve("./dist/css"),
    //                 //     }
    //                 // },
    //                 {
    //                     loader: MiniCssExtractPlugin.loader
    //                 },
    //                 {
    //                     loader: "css-loader"
    //                 },
    //                 {
    //                     loader: "sass-loader",
    //                     options: {
    //                         additionalData: `@import "./src/assets/theme/red.scss";`,
    //                     }
    //                 },
    //             ]
    //         },
    //         ]
    //     },
    //     plugins: [
    //         new HtmlWebpackPlugin({
    //             template: "./public/index.html"
    //         }),
    //         new VueLoaderPlugin(),
    //         new MiniCssExtractPlugin({
    //             filename: '[name].css',
    //             insert(linkTag) {
    //                 console.log(123, linkTag);
    //             }
    //         })
    //     ]
    // }
]