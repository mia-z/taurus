import React, { FC, useEffect, useState } from "react";
import Spotify from "spotify-web-api-js";
import PlaybackBar from "../components/PlaybackBar";
import MainBody from "./subviews/MainBody";

type PlayerProps = {
    token: string
}

export const Player: FC<PlayerProps> = ({ token }) => {
    const [spotify, setSpotify] = useState<Spotify.SpotifyWebApiJs | null>(null);
    const [spotifyDevice, setSpotifyDevice] = useState<any>(null);

    useEffect(() => {
        if (!spotify) {
            const client = new Spotify();
            client.setAccessToken(token);
            setSpotify(client);
        }

        if (!spotifyDevice) {
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
        
            document.body.appendChild(script);

            //@ts-ignore
            window.onSpotifyWebPlaybackSDKReady = () => {
                //@ts-ignore
                const player = new window.Spotify.Player({
                    name: 'Tauri Player',
                    getOAuthToken: (cb: any) => { cb(token); },
                    volume: 1
                });
        
                //@ts-ignore
                player.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                    player.did = device_id;
                });

                //@ts-ignore
                player.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                });
        
                setSpotifyDevice(player);

                player.connect();
            };
        }

        return () => {
            if (spotifyDevice) {
                spotifyDevice.disconnect();
            }
        }
    }, []);

    return(
        <div className={"h-screen w-full bg-black flex flex-col"}>
            <MainBody spotifyDevice={spotifyDevice} spotify={spotify as Spotify.SpotifyWebApiJs} />
            <PlaybackBar spotifyDevice={spotifyDevice} spotify={spotify as Spotify.SpotifyWebApiJs} />
        </div>
    );
}

export default Player;