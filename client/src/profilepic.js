import React from "react";

export default function ProfilePic({
    first,
    profilePic = "../default-profile-pic.jpg",
    toggleUploader,
}) {
    return (
        <div>
            {profilePic ? (
                <img
                    onClick={() => toggleUploader()}
                    src={profilePic}
                    alt={first}
                />
            ) : (
                <img
                    onClick={() => toggleUploader()}
                    src="../default-profile-pic.jpg"
                    alt={first}
                />
            )}
        </div>
    );
}
