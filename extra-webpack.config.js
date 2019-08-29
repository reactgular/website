module.exports = {
    module: {
        rules: [
            {test: /\.txt$/, use: 'raw-loader'},
            {test: /\.template$/, use: 'raw-loader'}
        ]
    }
};
