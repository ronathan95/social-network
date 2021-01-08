import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset-passowrd";

export default function Welcome() {
    return (
        <div className="welcome">
            <h1>Propaganda Spots</h1>
            <h2>Featuring you and influencing the entire world</h2>
            <HashRouter>
                <>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset-password" component={ResetPassword} />
                </>
            </HashRouter>
        </div>
    );
}
