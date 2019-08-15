import React, { Component } from "react";
import {
  Text
} from 'react-native';
import logo from "./logo.svg";
import "./App.css";
import {spotifyClientId} from "./auth.json";
import {getPlaylists} from "./helperfunctions";
import {getTracks} from './helperfunctions';
import {sleep} from './helperfunctions';
import {
  Alert,
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

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        //token: null,
        token: "BQCF6SfwcAKFrJiuz2n_F9xyeutPOGsSJ-IkI7VKahR0MJTYYb_gkpPh8neEauFSsQxdNDDW-qYombvfTfSZHBGcK8jmSodlR9LY2IZbY6B8v2TnpE0DRnj4Fl2me1H3b0O0oHQHU32m0-KtmwpwbgqMz33BiQBOgAoUqPXn2zGzuusyf-U__g",
        playlists: null,
        filteredPlaylists: null,
        isTableLoading: false,
        isGettingTracks: false,
      }
    }

    componentDidMount() {
      // Set token
      let _token = hash.access_token;
      if (_token) {
        // Set token
        this.setState({
          token: _token,
          col: [],
        });
      }
      this.setState({col: this.columns()})
    }

    columns = (playlist = null) => {
      const width = 500;
      return [
        {
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
        },
        {
          Header: 'Download',
          accessor: 'download',
          headerStyle: { whiteSpace: 'unset' },
          style: {whitespace: 'unset'},
          maxWidth: width,
          Cell: <Button color="primary">Download Playlist</Button>
        }
      ]
    }

    handleGetPlaylists = async () => {
      this.setState({isTableLoading: true})
      var res = await getPlaylists(this.state.token);
      var filteredList = filterPlaylist(res);
      this.setState(() => {
        return {playlists: res, filteredPlaylists: filteredList, isTableLoading: false}
      })
    }

    handleDownloadAllButton = async () => {
      await this.setState({isGettingTracks: true})
      for(var i = 0; i < this.state.playlists.length; i++) {
        await sleep(100);
        var playlist = this.state.playlists[i];
        var res = await getTracks(this.state.token, playlist.tracks.href, playlist.tracks.total)
      }
      await this.setState({isGettingTracks: false})
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
              <Alert color="info" isOpen={this.state.isGettingTracks}>Getting tracks, please wait</Alert>
              <div>
                <Button color="primary" disabled={this.state.isGettingTracks} onClick={this.handleGetPlaylists}>Get playlists</Button>{" "}
                <Button color="primary" disabled={this.state.isGettingTracks} onClick={this.handleDownloadAllButton}>Download All</Button>
              </div>
              {this.state.col && (
                <ReactTable
                    loadingText="Fetching data from Spotify"
                    loading={this.state.isTableLoading}
                    NoDataComponent={() => null}
                    data={this.state.filteredPlaylists || []}
                    columns={this.state.col}
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