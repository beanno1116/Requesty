import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { Requesty } from './requesty/Requesty.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))

const req = new Requesty();
const headers = {
  "Content-Type": "application/json",
  "Accept": "application/json"
}
const requestOptions = {
  headers:headers,
  body: "hello world",
  requestKey: "posts"
}
let response = req.request("GET","https://jsonplaceholder.typicode.com/posts",requestOptions).then(response => {
  let tmpres = response.json();
  debugger;
  console.log("");
});
console.log(response);

console.log("");
