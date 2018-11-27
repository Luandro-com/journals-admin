const withPlugins = require('next-compose-plugins')
const withOffline = require('next-offline')
const optimizedImages = require('next-optimized-images');
const withGraphql = require('next-plugin-graphql')
const withCSS = require('@zeit/next-css')
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const withPreact = require('@zeit/next-preact')

module.exports = withPlugins([
  // [withPreact],
  [optimizedImages, {
    /* config for next-optimized-images */
  }],
  [withOffline],
  [withGraphql],
  [withCSS],
  [withBundleAnalyzer, {
    analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: 'static',
        reportFilename: '../../bundles/server.html'
      },
      browser: {
        analyzerMode: 'static',
        reportFilename: '../bundles/client.html'
      }
    }  
  }],
])
