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
      xhr.setRequestHeader("Accept", "application/json")
      xhr.setRequestHeader("Content-Type", "application/json")
      xhr.send()
    })
  }

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
  

export async function getPlaylists(token) {
  const limit = 50;
  var link = `https://api.spotify.com/v1/me/playlists`;
  var playlists = [];
  var res = await get(link, token);
  playlists = playlists.concat(res.items);
  while(playlists.length < res.total) {
    var block = await sleep(25);
    link = `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${playlists.length}`;
    res = await get(link, token);
    playlists = playlists.concat(res.items);
  }
  return playlists;
}

export function filterPlaylist(playlists) {
  var newList = playlists.map(playlist => {
    var newList = {};
    newList['playlistName'] = playlist.name;
    newList['playlistLength'] = playlist.tracks.total;
    newList['link'] = playlist.external_urls.spotify;
    return newList;
  })
  return newList;
}