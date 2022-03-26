import React, { Dispatch, FC, SetStateAction } from "react";
import { useParams, Redirect } from "react-router-dom";

type AuthRedirectProps = {
    setToken: Dispatch<SetStateAction<string | null>>
}

export const AuthRedirect: FC<AuthRedirectProps> = ({ setToken }) => {
    const params = useParams<{ token: string }>();

    if (!params.token)
        return (
            <div>
                token fail
            </div>
        ); 
    else {
        setToken(params.token);
        return <Redirect to={"/"} />
    }
}