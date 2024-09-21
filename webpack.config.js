const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        app: path.resolve(__dirname, 'src', 'index.js'),
        // Package each language's worker and give these filenames in `getWorkerUrl`
        'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
        'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
        'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
        'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
        'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
        bt:{
            library: {
                name: 'bt',
                type: 'umd',
                // umdNamedDefine: true,
              },
            import: './src/lib/nodes/index.js'
            
        }
    },
    devServer: {
        hot: true,
        port: 4000
      },
    devtool: 'source-map',
    
    output: {
        assetModuleFilename: 'assets/[hash][ext][query]', // Все ассеты будут
        globalObject: 'self',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js|mjs)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                "targets": "defaults"
                            }],
                            '@babel/preset-react'
                        ]
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.ttf$/,
                type: 'asset/resource'
            }
        ]
    },
    optimization: {
        runtimeChunk: 'single'
    },
    plugins: [
        new MonacoWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ]
};