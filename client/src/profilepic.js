import React from "react";

export default function ProfilePic({ first, profilePic, toggleUploader }) {
    return (
        <div>
            {profilePic && (
                <img
                    onClick={() => toggleUploader()}
                    src={profilePic}
                    alt={first}
                />
            )}
            {!profilePic && (
                <img
                    onClick={() => toggleUploader()}
                    src="../default-profile-pic.jpg"
                    alt={first}
                />
            )}
        </div>
    );
}
