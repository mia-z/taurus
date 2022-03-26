import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";

type LoginProps = {
    
}

export const Login: FC<LoginProps> = ({ }) => {

    return(
        <div className={"h-screen w-full bg-black flex flex-col relative"}>
            <div className={"my-auto grid grid-cols-12 grid-flow-row"}>
                <img className={"col-start-5 col-span-4"} src={"./src/assets/img/Spotify_Logo_RGB_Green.png"} />
                <div className={"col-start-5 col-span-4 text-right"}>
                    <div className={"text-white text-sm select-none font-bold"}>
                        made with Tauri.
                    </div>
                </div>
                <div className={"col-start-5 col-span-4 flex justify-center mt-16"}>
                    <button className={"rounded-full w-1/2 bg-green text-white p-3 cursor-pointer"}>
                        <Link className={"w-full"} to={{ pathname: "https://preview.miaz.xyz/api/auth/login"}} target={"_parent"}>
                            Login
                        </Link>
                    </button>
                </div>
            </div>
            <div className={"text-center text-white text-xs select-none"}>
                {`Login information is handled by Spotify's secure server.`}
                <br />
                {`None of your personal information is ever saved.`}
            </div>
        </div>
    );
}

export default Login;