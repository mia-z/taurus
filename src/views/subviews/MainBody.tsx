import React, { FC, useCallback, useEffect, useState } from "react";
import Spotify from "spotify-web-api-js";

type MainBodyProps = {
    spotify: Spotify.SpotifyWebApiJs,
    spotifyDevice: any
}

export const MainBody: FC<MainBodyProps> = ({ spotify, spotifyDevice}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any>([]);
    const [selectedArtistTracks, setSelectedArtistTracks] = useState<any>([]);

    const getSearchResults = useCallback(async (query: string) => {
        console.log(query);
        const results = await spotify.searchArtists(query);
        setSearchResults(results.artists.items);
        console.log(results);
    }, [spotify]);

    const onSearchInput = useCallback(({ target: { value } }) => {
        setSearchTerm(value)
    }, []);

    const onSearchKeyDown = useCallback(({ key }) => {
        if (key === "Enter") {
            getSearchResults(searchTerm);
        }
    },[searchTerm]);

    const setArtistFromSearch = useCallback(async (artistId: string) => {
        const tracks = await spotify.getArtistTopTracks(artistId, "US");
        setSelectedArtistTracks(tracks.tracks);
        console.log(tracks);
    }, [spotify]);

    const playTrack = useCallback(async (trackUri: string) => {
        console.log(spotifyDevice)
        await spotify.play({
            device_id: spotifyDevice.did,
            uris: [ trackUri ]
        });

    }, [spotify, spotifyDevice]);

    return(
        <div className={"main-body text-white p-2"}>
            <input value={searchTerm} onChange={onSearchInput} onKeyDown={onSearchKeyDown} className={"rounded-full text-black px-2 outline-green"} />
            {
                searchResults.slice(0, 3).map((artist: SpotifyApi.ArtistObjectFull, index: number) => (
                    <div className={"text-white"} onClick={() => setArtistFromSearch(artist.id)}>
                        {artist.name}
                    </div>
                ))
            }
            <br />
            {
                selectedArtistTracks.slice(0, 5).map((track: SpotifyApi.TrackObjectFull, index: number) => (
                    <div onClick={() => playTrack(track.uri)}>
                        {track.name}
                    </div>
                ))
            }
        </div>
    );
}

export default MainBody;