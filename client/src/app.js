import axios from "axios";
import { Component } from "react";
import Profile from "./profile";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            first: "",
            last: "",
            email: "",
            bio: "",
            createdAt: "",
            profilePic: "",
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        axios
            .get("/profile-info")
            .then(({ data }) => {
                this.setState({ ...data });
            })
            .catch((err) => {
                console.error("erron on axios.get(/profile-info): ", err);
            });
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    updateProfilePic(newProfilePic) {
        this.setState({
            profilePic: newProfilePic,
        });
    }

    updateBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    render() {
        return (
            <div>
                <h1>App</h1>
                <ProfilePic
                    first={this.state.first}
                    profilePic={this.state.profilePic}
                    toggleUploader={() => this.toggleUploader()}
                />
                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    profilePic={this.state.profilePic}
                    bio={this.state.bio}
                    toggleUploader={() => this.toggleUploader()}
                    updateBio={(newBio) => this.updateBio(newBio)}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        updateProfilePic={(newProfilePic) =>
                            this.updateProfilePic(newProfilePic)
                        }
                    />
                )}
            </div>
        );
    }
}
