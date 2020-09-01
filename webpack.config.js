// const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');

// const pathsToCopy = [
// 	{ from: 'assets', to: 'assets' }
// ];

module.exports = {
	devtool: 'source-map',
	output: {
		path: __dirname + '/build',
	},
	target: 'web',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: "html-loader"
					}
				]
			},
			{
				test: /\.(css)$/,
				exclude: [
					/node_modules\/tinymce/,
				],
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader",
						options: {
							importLoaders: 1,
							sourceMap: true
						}
					},
					{
						loader: "postcss-loader",
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(png|jpg|gif|woff2?|svg|eot|ttf|ogg|mp3)$/,
				exclude: /assets/,
				use: [
					{
						loader: "file-loader",
						options: {}
					}
				]
			},
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		// new CopyPlugin({
		// 	patterns: pathsToCopy,
		// }),
		new HtmlWebpackPlugin({
			inject: true,
			template: "./src/index.html",
			filename: "./index.html"
		})
	]
};