import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset-passowrd";

import { Typography } from "@material-ui/core";

export default function Welcome() {
    return (
        <div className="welcome">
            <Typography variant="h2">Propaganda Spots</Typography>
            <Typography variant="h3">
                Featuring you and influencing the entire world
            </Typography>
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
