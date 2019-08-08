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