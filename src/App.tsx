import { FC, useEffect, useState } from "react";
import { ResponseType } from "@tauri-apps/api/http";
import { Switch, Route, Link, useParams } from "react-router-dom";
import { AuthRedirect } from "./views/AuthRedirect";
import Player from "./views/Player";
import Login from "./views/Login";
import "./styles/globals.scss";

export const App: FC = () => {
	const [token, setToken] = useState<string | null>(null);

	return (
		<div className={"text-xl"}>
			<Switch>
				<Route path="/TOKEN_REDIR/:token">
					<AuthRedirect setToken={setToken} />
				</Route>
				<Route path="/">
					{
						!token ? 
						<Login /> :
						<Player token={token as string} />
					}
				</Route>
			</Switch>
		</div>
	);
}
	
export default App;