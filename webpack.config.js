const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pathsToCopy = [
	{ from: 'translations', to: 'i18n' }
];

module.exports = {
	devtool: 'source-map',
	entry: {
		index: path.resolve(process.cwd(), 'src', 'index.js'),
		v1: path.resolve(process.cwd(), 'src', 'v1', 'index.jsx')
	},
	output: {
		path: __dirname + '/build',
	},
	target: 'web',
	devServer: {
		proxy: {
//			'/zx/login/supported': {
//				bypass: (req, res) => res.send({
//					minApiVersion: 1
//				}),
//			},
			'/zx': {
				target: 'https://infra-35eba87b.testarea.zextras.com/',
				secure: false
			}
		}
	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
		alias: {
			'@zextras/zapp-ui': path.resolve(process.cwd(), 'zapp-ui', 'src', 'index'),
			'assets': path.resolve(process.cwd(), 'assets'),
		}
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader'
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
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(png|jpg|gif|woff2?|svg|eot|ttf|ogg|mp3)$/,
				//exclude: /assets/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'assets'
						}
					}
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: pathsToCopy,
		}),
		new HtmlWebpackPlugin({
			inject: true,
			template: './src/index.html',
			filename: './index.html',
			chunks: ['index']
		})
	]
};
