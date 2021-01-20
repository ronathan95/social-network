import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

import { Typography, Button, Input, Paper } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            pw: "",
            error: false,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleClick() {
        axios
            .post("/login", this.state)
            .then((res) => {
                if (!res.data.success) {
                    this.setState({ error: true });
                } else {
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.error("erron on axios.post(/login): ", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <Paper className="login">
                <Typography variant="h5">Login</Typography>
                {this.state.error && (
                    <Typography
                        className="login-element"
                        variant="body1"
                        color="error"
                    >
                        <ErrorIcon /> Something went wrong, please try again
                    </Typography>
                )}
                <Input
                    className="login-element"
                    onChange={(e) => this.handleChange(e)}
                    type="text"
                    name="email"
                    placeholder="Email"
                />
                <Input
                    className="login-element"
                    onChange={(e) => this.handleChange(e)}
                    type="password"
                    name="pw"
                    placeholder="Password"
                />
                <Button
                    className="login-element"
                    variant="outlined"
                    onClick={() => this.handleClick()}
                >
                    Login
                </Button>
                <Typography className="login-element" variant="body1">
                    Don't have an account yet?
                </Typography>
                <Link to="/">
                    <Typography className="login-element" variant="body1">
                        Register!
                    </Typography>
                </Link>
                <Typography className="login-element" variant="body1">
                    Forgot your password?
                </Typography>
                <Link to="/reset-password">
                    <Typography className="login-element" variant="body1">
                        Reset password
                    </Typography>
                </Link>
            </Paper>
        );
    }
}
