const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')
const path = require('path')

module.exports = {
  configureWebpack: {
    // Merged into the final Webpack config
    plugins: [
      new PurgeCSSPlugin({
        paths: glob.sync([
          path.join(__dirname, './public/index.html'),
          path.join(__dirname, './src/**/*.vue'),
          path.join(__dirname, './src/**/*.js')
        ]),
        extractors: [
          {
            extractor: class TailwindExtractor {
              static extract (content) {
                return content.match(/[A-z0-9-:/]+/g) || []
              }
            },
            extensions: ['css', 'html', 'js', 'vue']
          }
        ]
      })
    ]
  }
}
