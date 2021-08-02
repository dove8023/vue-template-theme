const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const dotenv = require("dotenv-webpack");
let environmentVariables = new dotenv({
    systemvars: true
})

module.exports = [
    {
    mode: "development",
    target: "web",
    entry: {
        blue: "./src/main-index.ts",
    },
    output: {
        path: path.resolve("./dist"),
        filename: "[name].js",
        assetModuleFilename: 'images/[hash][ext][query]',
    },
    optimization: {
        minimize: false
    },
    resolve: {
        extensions: [".ts", ".js", ".tsx", ".vue"],
        alias: {
            "@": path.resolve(__dirname, "./src"),
        }
    },
    
    module: {
        rules: [{
            test: /\.vue$/,
            include: [
                path.resolve("./src"),
            ],
            loader: "vue-loader",
        },

        {
            test: /\.(png|jpg|gif|woff2|woff|ttf|svg)/,
            type: 'asset/resource',
        },

        {
            test: /\.tsx?$/,
            include: [
                path.resolve("./src")
            ],
            use: [{
                loader: "babel-loader",
                loader: "ts-loader",
            }]
        },
        {
            test: /\.scss$/,
            include: [
                path.resolve("./src"),
                path.resolve("./node_modules")
            ],
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        esModule: false
                    }
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

        {
            test: /\.css$/,
            include: [
                path.resolve("./src"),
                path.resolve("./node_modules")
            ],
            use: [
                {
                    loader: MiniCssExtractPlugin.loader
                },
                {
                    loader: "css-loader"
                },
            ]
        },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            hash: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',

            // insert: function (linkTag) {
            //     console.log(123, linkTag);
            // }

        }),
        new ModuleFederationPlugin({
            name: "Template",
            filename: "remoteEntry.js",
            // exposes: {
            //     "exposeInit": "./src/exposeInit.ts"
            // },
            // shared: require("./package.json").dependencies
        }),

        // new VueLoaderPlugin(),
        environmentVariables
    ]
},



// {
//     mode: "development",
//     target: "web",
//     entry: {
//         blue: "./src/main-index.ts",
//     },
//     output: {
//         path: path.resolve("./dist"),
//         filename: "[name].js"
//     },
//     optimization: {
//         minimize: false
//     },
//     resolve: {
//         extensions: [".ts", ".js", ".tsx"]
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
//             test: /\.tsx?$/,
//             include: [
//                 path.resolve("./src")
//             ],
//             use: [{
//                 loader: "ts-loader"
//             }]
//         },

//         {
//             test: /\.(s)?css$/,
//             include: [
//                 path.resolve("./src")
//             ],
//             use: [
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
//         // new VueLoaderPlugin(),
//         new MiniCssExtractPlugin({
//             filename: 'red.css',
//             insert: function (linkTag) {
//                 console.log(123, linkTag);
//             }
//         }),
//         new ModuleFederationPlugin({
//             name: "Template",
//             filename: "remoteEntry.js",
//             // exposes: {
//             //     "exposeInit": "./src/exposeInit.ts"
//             // },
//             // shared: require("./package.json").dependencies
//         }),

//         new VueLoaderPlugin()
//     ]
// },
]