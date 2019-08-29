const JSZip = require('jszip');
const FileSaver = require('file-saver');
const ObjectsToCsv = require('objects-to-csv');

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

export async function get2 (url, token) {
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

export const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
  

export async function getPlaylists(token) {
  const limit = 50;
  var link = `https://api.spotify.com/v1/me/playlists`;
  var playlists = [];
  var res = await get(link, token);
  playlists = playlists.concat(res.items);
  while(playlists.length < res.total) {
    await sleep(25);
    link = `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${playlists.length}`;
    res = await get(link, token);
    playlists = playlists.concat(res.items);
  }
  return playlists;
}

export async function getTracks(token, link, playlistLength) {
  const limit = 100;
  var tracks = [];
  var res = await get2(link, token);
  tracks = res.items;
  while(tracks.length < playlistLength) {
    await sleep(25);
    var limitedLink = `${link}?limit=${limit}&offset=${tracks.length}`;
    res = await get(limitedLink, token);
    tracks = tracks.concat(res.items);
  }

  var outTracks = [];
  tracks.forEach(track => {
    var info = `${track.track.name || 'Unknown'} - ${track.track.artists[0].name || 'Unknown'}`;
    outTracks = outTracks.concat(info);
  })

  return outTracks;
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

export function DownloadObjectAsCSV(obj, fileName, zipName) {
  const csv = new ObjectsToCsv(obj);
  const csvStr = csv.toString();
  var zip = new JSZip();
  zip.file(fileName, csvStr);
  zip.generateAsync({type:"blob"}).then( content => {
      FileSaver.saveAs(content, zipName);
  });
}
