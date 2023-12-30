
function hasBrowserSupport(){
  try {
    if (typeof XMLHttpRequest === undefined){
      return false;
    }
    return true;
  } catch (error) {
    console.error(error.message);
  }
}



function verifySignal(signal){
  try {
    if (!signal) {
      var abortController = new AbortController();
      return abortController.signal;
    }
    return signal;

  } catch (error) {
    console.error(error.message);
  }
}




function verifyUrl(urlStr=""){
  try {
    if (urlStr.length === 0) throw new Error("Invalid url string provided: " + urlStr);
    var verifiedUrl = new URL(urlStr);
    return verifiedUrl;
  } catch (error) {
    console.log(`Could not verify the url: ${error.message}`);
    return "";
  }
}


const headers = {
  contentType: "Content-Type"
}

export {
  hasBrowserSupport,
  verifySignal,
  verifyUrl,
  headers
}
