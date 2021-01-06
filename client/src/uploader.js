import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePic: {},
        };
    }

    handleClick() {
        const formData = new FormData();
        formData.append("image", this.state.profilePic);
        axios
            .post("/update-profile-pic", formData)
            .then((res) => {
                this.props.updateProfilePic(res.data.profilePic);
            })
            .catch((err) => {
                console.error(
                    "erron on axios.post(/update-profile-pic): ",
                    err
                );
            });
    }

    handleChange(e) {
        this.setState({
            profilePic: e.target.files[0],
        });
    }

    render() {
        return (
            <div>
                <h1>Uploader</h1>
                <h4>Want to change your profile picture?</h4>
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="profilePic"
                    type="file"
                    accept="image/*"
                />
                <button onClick={() => this.handleClick()}>Update</button>
            </div>
        );
    }
}
