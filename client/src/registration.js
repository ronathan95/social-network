import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

import { Typography, Button, Input, Paper } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";

export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
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
            .post("/registration", this.state)
            .then((res) => {
                if (!res.data.success) {
                    this.setState({ error: true });
                } else {
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.error("erron on axios.post(/registration): ", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <Paper className="registration">
                <Typography variant="h5">Registration</Typography>
                {this.state.error && (
                    <Typography
                        className="registration-element"
                        variant="body1"
                        color="error"
                    >
                        <ErrorIcon /> Something went wrong, please try again
                    </Typography>
                )}
                <Input
                    className="registration-element"
                    onChange={(e) => this.handleChange(e)}
                    type="text"
                    name="first"
                    placeholder="Firt Name"
                />
                <Input
                    className="registration-element"
                    onChange={(e) => this.handleChange(e)}
                    type="text"
                    name="last"
                    placeholder="Last Name"
                />
                <Input
                    className="registration-element"
                    onChange={(e) => this.handleChange(e)}
                    type="text"
                    name="email"
                    placeholder="Email"
                />
                <Input
                    className="registration-element"
                    onChange={(e) => this.handleChange(e)}
                    type="password"
                    name="pw"
                    placeholder="Password"
                />
                <Button
                    className="registration-element"
                    variant="outlined"
                    onClick={() => this.handleClick()}
                >
                    Register
                </Button>
                <Typography className="registration-element" variant="body1">
                    Already a member?
                </Typography>
                <Link to="/login">
                    <Typography
                        className="registration-element"
                        variant="body1"
                    >
                        Log in!
                    </Typography>
                </Link>
            </Paper>
        );
    }
}
