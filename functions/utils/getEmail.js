
module.exports = function getEmail(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}
