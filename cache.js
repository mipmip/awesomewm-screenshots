const fetch = require('node-fetch');

let url = "https://www.reddit.com/r/popular.json";

let settings = { method: "Get" };

fetch(url, settings)
  .then(res => res.json())
  .then((json) => {

    console.log(json);
    // do something with JSON
  });
