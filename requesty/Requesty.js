import { HttpResponse } from "./HttpResponse";
import { HttpError } from "./HttpError";
import { RequestClient } from "./RequestClient";
import { verifySignal, verifyUrl } from "./utils/utilities";


const doesSupportXhr = typeof XMLHttpRequest !== 'undefined';

const defaultOptions = {
  method: "GET",
  contentType: "application/json",
  headers: []
}

const createXHR = () => {
  try {
    if (doesSupportXhr) {
      return new XMLHttpRequest();
    }
    throw new Error("This enviroment does not support XMLHttpRequest");
  } catch (error) {
    console.error(error.message);
  }
}

const createRequest = (method,url,options,signal) => {
  try {

    const requestOptions = {...defaultOptions,...options}

    let xhrObj = createXHR(); 
  
    let request = {
      url: url,
      method: method.toUpperCase(),
      headers: {...options.headers},
      xhr: xhrObj,
      requestKey: requestOptions.requestKey,
      requestHash: JSON.stringify(requestOptions.requestKey),
      promise: null,
      subscribers: [],
      gcTimeout: null,
      state: {
        status: 'loading',
        isFetching: true,
        data: undefined,
        error: undefined,
      },
      setState: (updater) => {
        request.state = updater(request.state); 
        request.subscribers.forEach(subscriber => subscriber.notify());
      },
      setHeaders: () => {
        for (const key in request.headers) {
          
          if (Object.hasOwnProperty.call(request.headers, key)) {
            request.xhr.setRequestHeader(key, request.headers[key])
          }
        }
      },
      scheduleGC: () => {
        request.gcTimeout = setTimeout(() => {
          // client.queries = client.queries.filter(d => d !== query);
        },cacheTime)
      },
      unscheduleGC: () => {
        clearTimeout(request.gcTimeout);
      },
      subscribe: subscriber => {
        request.subscribers.push(subscriber);
  
        request.unscheduleGC();
  
        return () => {
          request.subscribers = request.subscribers.filter(d => d !== subscriber);
          if (request.subscribers.length){
            request.scheduleGC();
          }
        }
      },
      fetch: () => {
        if (!request.promise) {
          request.promise = (async () => {
            request.setState(old => ({...old,isFetching:true,error:undefined}));
            try {
              const data = await queryFn();
              request.setState(old=> ({...old,status:'success',lastUpdated: Date.now(),data}));
            } catch (error) {
              request.setState(old => ({...old,status:'error',error}))
            }finally{
              request.promise = null;
              request.setState(old => ({...old,isFetching:false}))
            }
          })();
        }
        return request.promise;
      },
    }
    return request;
    
  } catch (error) {
    console.error(error.message);
  }
}



const requestyInstance = (function createRequestyInstance(){
  var requestyInstance;
  var requestClient = new RequestClient();
  function createInstance(){

    let requestyObj = {      
      request: (method,url,options,signal) => {
        // debugger;
        const xhrObj = createRequest(method,url,options);
        xhrObj.xhr.open(xhrObj.method,xhrObj.url,true);
        xhrObj.setHeaders()
        


        if (options && options.hasOwnProperty("checkProgress")){
          xhrObj.xhr.upload.onprogress = options.checkProgress;
        }

        xhrObj.xhr.send(options.body);

        let tmp = requestClient.requests;
        
        console.log("");

        requestClient.requests.push(xhrObj);

        return new Promise((resolve,reject) => {
          xhrObj.xhr.onload = function() {
            
            resolve(new HttpResponse(xhrObj.xhr));
          }

          xhrObj.xhr.onerror = function() {
            reject(new HttpError(xhrObj.xhr));
          }

          xhrObj.xhr.onabort = function() {
            reject(new HttpError(xhrObj.xhr));
          }
          
        })

      },
      createSignalToken: () => {

      }
    }
    return requestyObj;
  }
  
  return {
    getRequestyInstance: function(){
      if (!requestyInstance){
        requestyInstance = createInstance();
      }
      return requestyInstance;
    }
  }
})();

function Requesty() {
  try {
    var instance = requestyInstance.getRequestyInstance();

    
    
    return instance;
  } catch (error) {
    console.error(error.message);
  }

}

export {
  Requesty
}