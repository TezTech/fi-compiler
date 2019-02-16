module.exports = {
  entry: "./index.js",
  output: {
    filename: "./fi-compile.min.js",
		library: "fi"
  },
  node: {
    fs: 'empty'
  }
}