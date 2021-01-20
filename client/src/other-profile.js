import { Component } from "react";
import axios from "./axios";
import FriendButton from "./friend-button";

import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
} from "@material-ui/core";

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
            <>
                <Card className="user-card">
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            alt="profile picture"
                            height="350"
                            image={this.state.profilePic}
                            title={this.state.first}
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                            >
                                {this.state.first} {this.state.last}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                            >
                                {this.state.bio}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <FriendButton id={this.state.id} />
                    </CardActions>
                </Card>
                {/* <img src={this.state.profilePic} alt="profile picture" />
                <p>
                    name: {this.state.first} {this.state.last}
                </p>
                <p>bio: {this.state.bio}</p>
                <FriendButton id={this.state.id} /> */}
            </>
        );
    }
}
