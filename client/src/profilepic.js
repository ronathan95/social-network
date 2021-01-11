import React from "react";

export default function ProfilePic({ first, profilePic, toggleUploader }) {
    return (
        <>
            {profilePic ? (
                <img
                    className="profilepic"
                    onClick={() => toggleUploader()}
                    src={profilePic}
                    alt={first}
                />
            ) : (
                <img
                    className="profilepic"
                    onClick={() => toggleUploader()}
                    src="../default-profile-pic.jpg"
                    alt={first}
                />
            )}
        </>
    );
}
