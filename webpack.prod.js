const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        main: './server.js'
    },
    output: {
        path: path.join(__dirname, 'prod-build'),
        publicPath: '/',
        filename: 'index.js',
        clean: true
    },
    mode: 'production',
    target: 'node',
    // externalPresets : {node: true},
    externals: [nodeExternals()], // Need this to avoid error when working with Express,
    // optimization: {
    //     minimize: true,
    //     minimizer: [
    //         new TerserPlugin({
    //             terserOptions: {
    //                 keep_classnames: true,
    //                 keep_fnames: true,
    //                 mangle: false
    //             }
    //         })
    //     ]
    // },
    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin({
            include: /\.min\.js$/
        })]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            }
        ]
    }
}