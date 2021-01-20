import { Component } from "react";
import axios from "./axios";

import { Typography, Button } from "@material-ui/core";

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

    closeModal() {
        this.props.toggleUploader();
    }

    render() {
        return (
            <div className="overlay">
                <Button onClick={() => this.closeModal()} variant="contained">
                    Close
                </Button>
                <Typography variant="h5">
                    Want to change your profile picture?
                </Typography>
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="profilePic"
                    type="file"
                    accept="image/*"
                />
                <Button onClick={() => this.handleClick()} variant="contained">
                    Update
                </Button>
            </div>
        );
    }
}
