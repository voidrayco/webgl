const {resolve} = require('path');
const DevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require(resolve('webpack.config.js'));
const PORT = process.env.PORT || 8080;

const devServerConfig =  {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
};

const app = new DevServer(webpack(config), devServerConfig);

app.listen(PORT, () => {
  console.log(`Server is available at http://localhost:${PORT} ...`);
});
