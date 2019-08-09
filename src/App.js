import React, { Component } from "react";
import {
  Text
} from 'react-native';
import logo from "./logo.svg";
import "./App.css";
import {spotifyClientId} from "./auth.json";
import {getPlaylists} from "./helperfunctions";
import {
  Alerts,
  Button
} from 'reactstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import {filterPlaylist} from './helperfunctions';

export const authEndpoint = 'https://accounts.spotify.com/authorize';

const clientId = spotifyClientId;
const redirectUri = "http://localhost:3000/";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-library-read",
  "playlist-read-private",
  "user-read-private"
];

const hash = window.location.hash // Get the hash of the url
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
}, {});window.location.hash = "";

const width = 500;
const columns = [{
    Header: 'Playlist Name',
    accessor: 'playlistName',
    headerStyle: { whiteSpace: 'unset' },
    style: {whitespace: 'unset'},
    maxWidth: width
  },
  {
    Header: 'Playlist Length',
    accessor: 'playlistLength',
    headerStyle: { whiteSpace: 'unset' },
    style: {whitespace: 'unset'},
    maxWidth: width
  },
  {
    Header: 'Link',
    accessor: 'link',
    headerStyle: { whiteSpace: 'unset' },
    style: {whitespace: 'unset'},
    maxWidth: width
  }
]

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        token: null,
        playlists: null
      }
    }

    componentDidMount() {
      // Set token
      let _token = hash.access_token;
      if (_token) {
        // Set token
        this.setState({
          token: _token
        });
      }
      this.handlePlaylistButton = this.handlePlaylistButton.bind(this);
    }

    async handlePlaylistButton() {
      var res = await getPlaylists(this.state.token);
      //Filter playlist data before running setstate
      var filteredList = filterPlaylist(res);
      this.setState(() => {
        return {playlists: filteredList}
      })
    }

    render() {
      return (
        <div className="App">
          <header className="App-header">
            Exportify
          </header>
          <div className="App-body">
            {!this.state.token && (
              <div className="Login-screen">
                <img src={logo} className="App-logo" alt="logo" />
                <Button 
                  color="primary" 
                  size="lg"
                  href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`} >
                    Login
                </Button>
              </div>
            )}
            {this.state.token && (
              <div>
                <div>
                  <Button color="primary" onClick={this.handlePlaylistButton}>Get playlists</Button>{" "}
                  <Button color="primary" onClick={console.log("hello")}>Foo</Button>
                </div>
                {this.state.playlists && (
                  <ReactTable
                    data={this.state.playlists}
                    columns={columns}
                    manual
                    minRows={20}
                    pageSize={1}
                    pages={0}
                    showPagination={true}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
}
  
export default App;