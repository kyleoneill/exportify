const https = require('https');

export function getRequest(link) {
    https.get(link, (res) => {
        let data = "";
        res.on('data', (chunk) => {
            data += chunk;
        })
        res.on('end', () => {
            return JSON.parse(data.explanation);
        });
    }).on('error', (err) => {
        console.log(`Error: ${err.message}`)
    })
}

export async function get (url, token) {
    return new Promise((resolve, reject) => {
      let xhr = new window.XMLHttpRequest()
      xhr.addEventListener('load', (e) => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(new Error(xhr.responseText))
        }
      })
      xhr.addEventListener('error', (e) => {
        reject(new Error(xhr.responseText))
      })
      xhr.open('GET', url)
      xhr.setRequestHeader("Authorization", `Bearer ${token}`)
      xhr.send()
    })
  }