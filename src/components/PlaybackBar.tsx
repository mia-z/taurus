import React, { FC, useCallback, useEffect, useState } from "react";
import Spotify from "spotify-web-api-js";
import { BsSkipEndFill, BsSkipStartFill, BsArrowRepeat, BsShuffle, BsPlayCircleFill, BsPauseCircleFill } from "react-icons/bs";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';

type PlaybackBarProps = {
    spotify: Spotify.SpotifyWebApiJs,
    spotifyDevice: any
}

//Create abstractions for buttons later maybe
const baseUtilityStyles = "";

export const PlaybackBar: FC<PlaybackBarProps> = ({ spotify, spotifyDevice }) => {
    const [currentPlaybackState, setCurrentPlaybackState] = useState<any>(null);
    const [currentVolume, setCurrentVolume] = useState(0);

    const setVolume = useCallback(async (value) => {
        await spotifyDevice?.setVolume(value);
        setCurrentVolume(value);
    }, [spotifyDevice]);

    const togglePlay = useCallback(async () => {
        await spotifyDevice?.togglePlay();
    }, [spotifyDevice]);

    useEffect(() => {
        if (spotifyDevice) {
            spotifyDevice.addListener("player_state_changed", (playerState: any) => {
                setCurrentPlaybackState(playerState);
            });
        }

        return () => {
            if (spotifyDevice) {
                spotifyDevice.removeListener("player_state_changed");
            }
        }
    }, [spotifyDevice]);

    useEffect(() => {
        var refreshInterval: any;
        if (currentPlaybackState && !currentPlaybackState?.paused && spotifyDevice) {
            refreshInterval = setInterval(() => {
                spotifyDevice.getCurrentState().then((playbackState: any) => {
                    setCurrentPlaybackState(playbackState);
                })
            }, 250);
        }

        return () => {
            clearInterval(refreshInterval);
        }
    }, [spotifyDevice, currentPlaybackState?.paused]);

    useEffect(() => {
        (async () => {
            const vol = await spotifyDevice?.getVolume();
            setCurrentVolume(vol * 100);
        })();
    }, [spotifyDevice]);

    useEffect(() => {
        console.log(currentPlaybackState);
    }, [currentPlaybackState]);

    return(
        <div className={"playback-bar border-t-[2px] border-t-[#242424] bg-zinc-800"}>
            <div className={"grid grid-cols-12 grid-rows-1 w-100 h-full p-1"}>
                <div className={"col-start-1 col-span-1 flex flex-col"}>
                    <img className={"h-5/6 w-5/6 m-auto rounded-sm border-2 border-[#242424] shadow-md"} src={currentPlaybackState?.track_window?.current_track.album.images[2].url} />
                </div>
                <div className={"col-start-2 col-span-2 flex flex-col my-auto"}>
                    <div className={"text-sm text-white text-center"}>
                        {currentPlaybackState?.track_window?.current_track.artists[0].name}
                    </div>
                    <div className={"text-sm text-white text-center"}>
                        {currentPlaybackState?.track_window?.current_track.name}
                    </div>
                </div>
                <div className={"col-start-4 col-span-6 flex flex-col py-2"}>
                    <div className={"flex flex-row h-1/2 justify-center space-x-3"}>
                        <BsShuffle className={"text-white opacity-60 hover:opacity-100 active:opacity-60 text-xl my-auto"} />
                        <BsSkipStartFill className={"text-white opacity-60 hover:opacity-100 active:opacity-60 text-2xl my-auto"} />
                        {
                            ( !currentPlaybackState || currentPlaybackState?.paused) ?
                            <BsPlayCircleFill onClick={() => togglePlay()} className={"text-white scale-100 hover:scale-105 active:scale-100 text-3xl my-auto"} /> :
                            <BsPauseCircleFill onClick={() => togglePlay()} className={"text-white scale-100 hover:scale-105 active:scale-100 text-3xl my-auto"} />
                        }
                        <BsSkipEndFill className={"text-white opacity-60 hover:opacity-100 active:opacity-60 text-2xl my-auto"} />
                        <BsArrowRepeat className={"text-white opacity-60 hover:opacity-100 active:opacity-60 text-1xl my-auto"} />
                    </div>
                    <div className={"flex flex-row h-1/2 px-2"}>
                        <Slider 
                            className={"my-auto"}
                            railStyle={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                            trackStyle={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                            handleStyle={{ border: "none" }}
                            value={currentPlaybackState?.position}
                            draggableTrack={true}
                            max={currentPlaybackState?.duration}
                            onAfterChange={(value) => spotifyDevice.seek(value)}
                        />
                    </div>
                </div>
                <div className={"col-start-11 col-span-2 px-3 flex flex-row"}>
                    <Slider 
                        className={"my-auto"}
                        railStyle={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                        trackStyle={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                        handleStyle={{ border: "none" }}
                        value={currentVolume * 100}
                        onChange={(value) => setVolume(value / 100)}
                    />
                </div>
            </div>
        </div>
    );
}

export default PlaybackBar;