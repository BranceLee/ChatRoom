// webpack v3
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const autoprefixerPlugin = require('autoprefixer');

module.exports = {
    entry: ['@babel/polyfill', './client/src/index.jsx'],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[hash].js'
    },

    devServer: {
        contentBase: './dist',
        host: '0.0.0.0',
        port: 3000,
        hot: true
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react'
                            ]
                        }
                    },
                    {
                        loader: 'eslint-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixerPlugin]
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixerPlugin]
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './client/src/index.html',
            filename: 'index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true //删除空白符与换行符
            }
        }),
        new WebpackMd5Hash()
    ]
};
