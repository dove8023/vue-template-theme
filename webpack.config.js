const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    mode: "development",
    target: "web",
    entry: "./src/main.js",
    output: {
        path: path.resolve("./dist"),
        filename: "bundle.js"
    },
    optimization: {
        minimize: false
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
            test: /\.scss$/i,
            include: [
                path.resolve("./src")
            ],
            use: [
                {
                    loader: "file-loader",
                },
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
                        // additionalData: `@import "${path.resolve('./src/assets/theme/red.scss')}";`,

                        additionalData: (content, loaderContext) => {
                            const { resourcePath, rootContext } = loaderContext;
            
                            return  `@import "${path.resolve('./src/assets/theme/red.scss')}";`
                          },
                    }
                }
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'main.css',
            linkType: false
        }),

        // new MiniCssExtractPlugin({
        //     filename: 'main2.css',
        //     linkType: false
        // })
    ]
}