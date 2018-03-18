/**
 * File containing which database to use depending on what environment we are on
 */

if (process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb://marcus:marcus@ds117719.mlab.com:17719/vidjot-production-1'};
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'};
}
