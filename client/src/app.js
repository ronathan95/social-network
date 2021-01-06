import axios from "axios";
import { Component } from "react";
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
            createdAt: "",
            profilePic: "",
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        axios
            .get("/profile-info")
            .then((res) => {
                this.setState({
                    id: res.data.id,
                    first: res.data.first,
                    last: res.data.last,
                    email: res.data.email,
                    createdAt: res.data.createdAt,
                    profilePic: res.data.profilePic,
                });
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

    render() {
        return (
            <div>
                <h1>App</h1>
                <ProfilePic
                    first={this.state.first}
                    profilePic={this.state.profilePic}
                    toggleUploader={() => this.toggleUploader()}
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
