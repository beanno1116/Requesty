

const HttpError = function(xhr) {
  this.body = xhr.response;
  this.status = xhr.status;
  this.headers = xhr.getAllResponseHeaders().split("\r\n").reduce((result, current) => {
    let [name, value] = current.split(': ');
    result[name] = value;
    return result;
  })
}

HttpError.prototype.toString = function() {
  let json = JSON.parse(this.body)
  return "["+ this.status + "] Error: " + json.error || json.errors.join(", ")
}

export {
  HttpError
}