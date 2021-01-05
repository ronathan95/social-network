import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

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
            <div>
                <h1>Registration</h1>
                {this.state.error && (
                    <p>Something went wrong, please try again</p>
                )}
                <input
                    onChange={(e) => this.handleChange(e)}
                    type="text"
                    name="first"
                    placeholder="Firt Name"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    type="text"
                    name="last"
                    placeholder="Last Name"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    type="text"
                    name="email"
                    placeholder="Email"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    type="password"
                    name="pw"
                    placeholder="Password"
                />
                <button onClick={() => this.handleClick()}>Register</button>
                <p>Already a member? </p>
                <Link to="/login">Log in!</Link>
            </div>
        );
    }
}
