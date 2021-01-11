import axios from "./axios";
import { Component } from "react";
import Profile from "./profile";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import OtherProfile from "./other-profile";
import FindPeople from "./find-people";
import { BrowserRouter, Route } from "react-router-dom";

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
            <BrowserRouter>
                <div>
                    <div className="header">
                        <h3>Propos</h3>

                        <ProfilePic
                            first={this.state.first}
                            profilePic={this.state.profilePic}
                            toggleUploader={() => this.toggleUploader()}
                        />

                        <p className="header-userName">{this.state.first}</p>
                    </div>

                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                profilePic={this.state.profilePic}
                                bio={this.state.bio}
                                toggleUploader={() => this.toggleUploader()}
                                updateBio={(newBio) => this.updateBio(newBio)}
                            />
                        )}
                    />

                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                match={props.match}
                                key={props.match.url}
                                history={props.history}
                            />
                        )}
                    />

                    <Route path="/users" render={() => <FindPeople />} />

                    {this.state.uploaderIsVisible && (
                        <div className="overlay">
                            <Uploader
                                updateProfilePic={(newProfilePic) =>
                                    this.updateProfilePic(newProfilePic)
                                }
                            />
                        </div>
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
