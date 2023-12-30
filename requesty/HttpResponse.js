const HttpResponse = function(xhr) {
  
  this.body = xhr.response;
  this.status = xhr.status;
  let tmp = xhr.getAllResponseHeaders().split("\r\n").filter(e => e.includes(': '));
  this.headers = xhr.getAllResponseHeaders().split("\r\n").filter(e => e.includes(': ')).reduce((result, current) => {
    
    
    let [name, value] = current.split(': ');
    result[name] = value;
    return result;
  },{})
  this.parser = new DOMParser();
}

HttpResponse.prototype.json = function() {
  return JSON.parse(this.body);
}

HttpResponse.prototype.getAsDOM = function() {
  return this.parser.parseFromString(this.body, "text/html")
}

export {
  HttpResponse
}