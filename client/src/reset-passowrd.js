import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

import { Typography, Button, Input, Paper } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            code: "",
            pw: "",
            stage: 1,
            error: false,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    resetPw() {
        axios
            .post("/password/reset/start", this.state)
            .then((res) => {
                if (!res.data.success) {
                    this.setState({ error: true });
                } else {
                    this.setState({ error: false });
                    this.setState({ stage: 2 });
                }
            })
            .catch((err) => {
                console.error(
                    "erron on axios.post(/password/reset/start): ",
                    err
                );
                this.setState({ error: true });
            });
    }

    updatePw() {
        axios
            .post("/password/reset/verify", this.state)
            .then((res) => {
                if (!res.data.success) {
                    this.setState({ error: true });
                } else {
                    this.setState({ error: false });
                    this.setState({ stage: 3 });
                }
            })
            .catch((err) => {
                console.error(
                    "erron on axios.post(/password/reset/verify): ",
                    err
                );
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <Paper className="reset-pw">
                <Typography variant="h5">Reset Password</Typography>
                {this.state.error && (
                    <Typography
                        className="reset-pw-element"
                        variant="body1"
                        color="error"
                    >
                        <ErrorIcon /> Something went wrong, please try again
                    </Typography>
                )}
                {this.state.stage === 1 && (
                    <div>
                        <Input
                            className="reset-pw-element"
                            onChange={(e) => this.handleChange(e)}
                            type="text"
                            name="email"
                            placeholder="Email"
                        />
                        <Button
                            className="reset-pw-element"
                            variant="outlined"
                            onClick={() => this.resetPw()}
                        >
                            Reset password
                        </Button>
                        <Typography
                            className="reset-pw-element"
                            variant="body1"
                        >
                            Don't have an account yet?
                        </Typography>
                        <Link to="/">
                            <Typography
                                className="reset-pw-element"
                                variant="body1"
                            >
                                Register!
                            </Typography>
                        </Link>
                    </div>
                )}
                {this.state.stage === 2 && (
                    <div>
                        <Input
                            className="reset-pw-element"
                            onChange={(e) => this.handleChange(e)}
                            type="text"
                            name="code"
                            placeholder="Verification Code"
                        />
                        <Input
                            className="reset-pw-element"
                            onChange={(e) => this.handleChange(e)}
                            type="password"
                            name="pw"
                            placeholder="New Password"
                        />
                        <Button
                            className="reset-pw-element"
                            variant="outlined"
                            onClick={() => this.updatePw()}
                        >
                            Update password
                        </Button>
                    </div>
                )}
                {this.state.stage === 3 && (
                    <div>
                        <Typography className="reset-pw-element" variant="h5">
                            Success
                            <ThumbUpIcon />
                        </Typography>
                        <Link to="/login">
                            <Typography
                                className="reset-pw-element"
                                variant="body1"
                            >
                                You can log in with your new password
                            </Typography>
                        </Link>
                    </div>
                )}
            </Paper>
        );
    }
}
