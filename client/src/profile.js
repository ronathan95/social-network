import React, { useState } from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bio-editor";
import axios from "./axios";

import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    Button,
} from "@material-ui/core";

export default function Profile({
    first,
    last,
    profilePic,
    bio,
    toggleUploader,
    updateBio,
}) {
    const [deletionMessage, setDeletionMessage] = useState(false);

    function deleteAccount() {
        console.log("account deletion isn't avilable at the moment");
        // axios
        //     .post("/delete-account")
        //     .then(() => {})
        //     .catch((err) => {
        //         console.error("erron on axios.post(/delete-account): ", err);
        //     });
    }

    return (
        <>
            <Card className="user-card">
                <CardActionArea>
                    <CardMedia
                        onClick={() => toggleUploader()}
                        component="img"
                        alt="profile picture"
                        height="400"
                        image={profilePic || "../default-profile-pic.jpg"}
                        title={first}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {first} {last}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            {bio || "no bio yet"}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <BioEditor bio={bio} updateBio={updateBio} />
                    <Button
                        onClick={() => {
                            setDeletionMessage(true);
                        }}
                    >
                        Delete Account
                    </Button>
                    {deletionMessage && (
                        <div className="overlay">
                            <Typography component="h2">
                                Are you sure you you would like to delete your
                                account?
                            </Typography>
                            <Button
                                onClick={() => {
                                    deleteAccount();
                                }}
                                variant="contained"
                            >
                                Yes
                            </Button>
                            <Button
                                onClick={() => {
                                    setDeletionMessage(false);
                                }}
                                variant="contained"
                            >
                                No
                            </Button>
                        </div>
                    )}
                </CardActions>
            </Card>
            {/* <h1>User profile component</h1>
            <ProfilePic
                profilePic={profilePic}
                toggleUploader={toggleUploader}
            />
            <h3>
                Hello, my name is {first} {last}
            </h3>
            <p>bio: {bio}</p>
            <BioEditor bio={bio} updateBio={updateBio} /> */}
        </>
    );
}
