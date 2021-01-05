import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

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
            .then(() => {})
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
            <div>
                <h1>Reset Password</h1>
                {this.state.error && (
                    <p>Something went wrong, please try again</p>
                )}
                {this.state.stage === 1 && (
                    <div>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            type="text"
                            name="email"
                            placeholder="Email"
                        />
                        <button onClick={() => this.resetPw()}>
                            Reset password
                        </button>
                        <p>Don't have an account yet? </p>
                        <Link to="/">Register!</Link>
                    </div>
                )}
                {this.state.stage === 2 && (
                    <div>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            type="text"
                            name="code"
                            placeholder="Verification Code"
                        />
                        <input
                            onChange={(e) => this.handleChange(e)}
                            type="password"
                            name="pw"
                            placeholder="New Password"
                        />
                        <button onClick={() => this.updatePw()}>
                            Update password
                        </button>
                    </div>
                )}
                {this.state.stage === 3 && (
                    <div>
                        <h3>Success!</h3>
                        <p>You can </p> <Link to="/login">log in</Link>
                        <p> with your new password</p>
                    </div>
                )}
            </div>
        );
    }
}
