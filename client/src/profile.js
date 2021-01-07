import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bio-editor";

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
            <h1>User profile component</h1>
            <ProfilePic
                profilePic={profilePic}
                toggleUploader={toggleUploader}
            />
            <h3>
                Hello, my name is {first} {last}
            </h3>
            <p>bio: {bio}</p>
            <BioEditor bio={bio} updateBio={updateBio} />
        </div>
    );
}
