import { Component } from "react";
import axios from "./axios";

import { Button, TextareaAutosize } from "@material-ui/core";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textareaIsVisible: false,
            draftBio: "",
        };
    }

    toggleTextarea() {
        this.setState({
            textareaIsVisible: !this.state.textareaIsVisible,
        });
    }

    handleChange(e) {
        this.setState({
            draftBio: e.target.value,
        });
    }

    updateBio() {
        axios
            .post("/update-bio", this.state)
            .then((res) => {
                this.props.updateBio(res.data.bio);
            })
            .catch((err) => {
                console.error("erron on axios.post(/update-bio): ", err);
            });
        this.toggleTextarea();
    }

    render() {
        return (
            <div>
                {this.state.textareaIsVisible && (
                    <>
                        <TextareaAutosize
                            onChange={(e) => this.handleChange(e)}
                            defaultValue={this.props.bio}
                        />
                        <Button
                            variant="outlined"
                            onClick={() => this.updateBio()}
                        >
                            Update Bio
                        </Button>
                    </>
                )}
                <div>
                    {this.props.bio ? (
                        <Button
                            variant="outlined"
                            onClick={() => this.toggleTextarea()}
                        >
                            {!this.state.textareaIsVisible
                                ? "Edit Bio"
                                : "cancel"}
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            onClick={() => this.toggleTextarea()}
                        >
                            {!this.state.textareaIsVisible
                                ? "Add Bio"
                                : "cancel"}
                        </Button>
                    )}
                </div>
            </div>
        );
    }
}
