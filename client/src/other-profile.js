import { Component } from "react";
import axios from "./axios";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            first: "",
            last: "",
            email: "",
            bio: "",
            createdAt: "",
            profilePic: "",
        };
    }

    componentDidMount() {
        axios
            .get("/other-profile-info/" + this.props.match.params.id)
            .then((res) => {
                if (res.data.sameUserOrNonExistingUser) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        id: res.data.id,
                        first: res.data.first,
                        last: res.data.last,
                        email: res.data.email,
                        bio: res.data.bio,
                        createdAt: res.data.createdAt,
                        profilePic: res.data.profilePic,
                    });
                }
            })
            .catch((err) => {
                console.error("erron on axios.get(/other-profile-info): ", err);
            });
    }

    render() {
        return (
            <div>
                <img src={this.state.profilePic} alt="profile picture" />
                <p>
                    name: {this.state.first} {this.state.last}
                </p>
                <p>bio: {this.state.bio}</p>
            </div>
        );
    }
}
