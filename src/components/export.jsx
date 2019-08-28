import React from "react";
import {getPlaylists} from "../util/helperfunctions";
import {getTracks} from "../util/helperfunctions";
import {sleep} from "../util/helperfunctions";
import {
  Alert,
  Button
} from 'reactstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import {filterPlaylist} from "../util/helperfunctions";

export const authEndpoint = 'https://accounts.spotify.com/authorize';

class Export extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          playlists: null,
          filteredPlaylists: null,
          isTableLoading: false,
          isGettingTracks: false,
          col: [],
          trackfulPlaylists: null
        }
    }

    componentDidMount() {
        this.setState({col: this.columns()})
    }

    columns = () => {
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
            //TODO: implement this
            // {
            //     Header: 'Download',
            //     accessor: 'download',
            //     headerStyle: { whiteSpace: 'unset' },
            //     style: {whitespace: 'unset'},
            //     maxWidth: width,
            //     Cell: <Button color="primary">Download Playlist</Button>
            // }
        ]
    }
  
    handleGetPlaylists = async () => {
        this.setState({isTableLoading: true})
        var res = await getPlaylists(this.props.token);
        var filteredList = filterPlaylist(res);
        this.setState(() => {
            return {playlists: res, filteredPlaylists: filteredList, isTableLoading: false}
        })
    }
  
    handleDownloadAllButton = async () => {
        //TODO: this takes a long time, add a loading bar / status indicator
        await this.setState({isGettingTracks: true})
        var trackfulPlaylists = []
        for(var i = 0; i < this.state.playlists.length; i++) {
            var trackfulPlaylist = new Object();
            await sleep(100);
            var playlist = this.state.playlists[i];
            var res = await getTracks(this.props.token, playlist.tracks.href, playlist.tracks.total);
            trackfulPlaylist.name = playlist.name;
            trackfulPlaylist.songs = res.slice(0);
            trackfulPlaylists.push(trackfulPlaylist);
            //TODO Create a csv for the playlist
        }
        //TODO create a zip of csv files
        await this.setState({isGettingTracks: false, trackfulPlaylists: trackfulPlaylists})
    }

    debug = () => {
        var debugObj = [];
        for(var i = 0; i < 10; i++) {
            var temp = new Object();
            temp.name = `Object ${i}`;
            temp.songs = [`song ${i}`, `song ${i+1}`, `song ${i+2}`];
            debugObj.push(temp)
        }
        console.log(debugObj)
    }

    render() {
        return (
            <div>
                <Alert color="info" isOpen={this.state.isGettingTracks}>Getting tracks, please wait</Alert>
                <div>
                    <Button color="primary" disabled={this.state.isGettingTracks} onClick={this.handleGetPlaylists}>Get playlists</Button>{" "}
                    <Button color="primary" disabled={this.state.isGettingTracks || !this.state.playlists} onClick={this.handleDownloadAllButton}>Download All</Button>
                    <Button color="primary" onClick={this.debug}>Debug</Button>
                </div>
                <br/>
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
        )
    }
}

export default Export
