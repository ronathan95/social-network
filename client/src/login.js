import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

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
            .then(() => {
                location.replace("/");
            })
            .catch((err) => {
                console.error("erron on axios.post(/login): ", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
                {this.state.error && (
                    <p>Something went wrong, please try again</p>
                )}
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
                <button onClick={() => this.handleClick()}>Login</button>
                <p>Don't have an account yet? </p>
                <Link to="/">Register!</Link>
            </div>
        );
    }
}
