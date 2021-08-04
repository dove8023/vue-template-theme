const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");


module.exports = [
{
    mode: "development",
    target: "web",
    entry: {
        blue: path.resolve("./src/main")
    },
    output: {
        path: path.resolve("./dist"),
        filename: "[name].js",
        assetModuleFilename: 'images/[hash][ext][query]'
    },
    optimization: {
        minimize: false,
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: "blue",
                    type: "css/mini-extract",
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },
    resolve: {
        extensions: [".ts", ".js", ".tsx", ".vue"],
        alias: {
            "@": path.resolve(__dirname, "./src"),
        }
    },
    module: {
        rules: [
        {
            test: /\.vue$/,
            include: [
                path.resolve("./src"),
            ],
            use: [
                {
                    loader: "vue-loader",
                    options: {
                        esModule: true,
                    }
                }
            ]
        },
        {
            test: /\.tsx?$/,
            include: [
                path.resolve("./src")
            ],
            use: [{
                loader: "ts-loader",
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            }]
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        },
        {
            test: /\.(s)?css$/,
            include: [
                path.resolve("./src")
            ],
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
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
            template: "./public/index.html",
            // hash: true,
            inject: false
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            // chunkFilename: 'blue.[id].css',
        }),
        // new ModuleFederationPlugin({
        //     name: "Template",
        //     filename: "remoteEntry.js",
        //     // exposes: {
        //     //     "exposeInit": "./src/exposeInit.ts"
        //     // },
        //     // shared: require("./package.json").dependencies
        // }),

        new VueLoaderPlugin()
    ]
}

]