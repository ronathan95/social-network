import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bio-editor";

import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
} from "@material-ui/core";

export default function Profile({
    first,
    last,
    profilePic,
    bio,
    toggleUploader,
    updateBio,
}) {
    return (
        <div>
            <Card className="other-user-card">
                <CardActionArea>
                    <CardMedia
                        component="img"
                        alt="profile picture"
                        height="240"
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
                            {bio}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <BioEditor bio={bio} updateBio={updateBio} />
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
        </div>
    );
}
