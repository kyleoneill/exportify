import React from "react";
import logo from "../logo.svg";
import {spotifyClientId} from "../auth.json";
import {
  Button
} from 'reactstrap';
import 'react-table/react-table.css'
import Export from './export';

const authEndpoint = 'https://accounts.spotify.com/authorize';

const redirectUri = "http://localhost:3000/";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-library-read",
  "playlist-read-private",
  "user-read-private"
];

const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
}, {});window.location.hash = "";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          token: null
        }
    }

    componentDidMount() {
        // Set token
        let _token = hash.access_token;
        if (_token) {
            // Set token
            this.setState({
            token: _token,
            });
        }
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
                    href={`${authEndpoint}?client_id=${spotifyClientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`} >
                      Login
                  </Button>
                </div>
              )}
              {this.state.token && (
                  <Export token={this.state.token}/>
              )}
            </div>
          </div>
        )
    }
}

export default Main
