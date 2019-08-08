import React, { Component } from "react";
import {
  Text
} from 'react-native';
import logo from "./logo.svg";
import "./App.css";
import {spotifyClientId} from "./auth.json";
import {getRequest} from "./helperfunctions";
import {get} from "./helperfunctions";
import {
  Alerts,
  Button
} from 'reactstrap';

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
        token: null,
        spotifyUser: null
      }
    }
    async handleAccountButton(token) {
      var link = "https://api.spotify.com/v1/me";
      var res = await get(link, token);
      this.setState(() => {
        return {spotifyUser: res}
      })
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
    }
    render() {
      return (
        <div className="App">
          <header className="App-header">
          {!this.state.token && (
            <div>
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
              <Text>Hey look we're authenticated!</Text>
              <Button color="primary" onClick={() =>{this.handleAccountButton(this.state.token)}}>Click Me</Button>
            </div>
          )}
          </header>
        </div>
      );
    }
}
  
export default App;