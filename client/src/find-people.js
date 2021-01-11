import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function FindPeople() {
    const [lastRegistered, setLastRegistered] = useState([]);
    const [searchedUser, setSearchedUser] = useState("");
    const [searchedUsersResults, setSearchedUsersResults] = useState([]);

    useEffect(() => {
        axios
            .get("/last-registered")
            .then(({ data }) => {
                setLastRegistered(data.lastRegisteredArray);
            })
            .catch((err) => {
                console.error("erron on axios.post(/last-registered): ", err);
            });
        axios
            .get("/find-user/" + searchedUser)
            .then(({ data }) => {
                setSearchedUsersResults(data.usersSearchResults);
            })
            .catch((err) => {
                console.error(
                    `erron on axios.post(/find-user/${searchedUser}): `,
                    err
                );
            });
    }, [searchedUser]);

    return (
        <div>
            <h1>Find People</h1>
            {!searchedUsersResults && (
                <div>
                    <p>Find out who just joind:</p>
                    <ul>
                        {lastRegistered.map((user, index) => (
                            <li key={index}>
                                <Link to={"/user/" + user.id}>
                                    <img src={user.profile_pic} />
                                </Link>
                                <Link to={"/user/" + user.id}>
                                    {user.first} {user.last}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <p>Are you looking for someone in particular?</p>
            <input
                onChange={(e) => setSearchedUser(e.target.value)}
                type="text"
                placeholder="Enter name"
            />
            {searchedUsersResults && (
                <ul>
                    {searchedUsersResults.map((user, index) => (
                        <li key={index}>
                            <Link to={"/user/" + user.id}>
                                <img
                                    src={
                                        user.profile_pic ||
                                        "../default-profile-pic.jpg"
                                    }
                                />
                            </Link>
                            <Link to={"/user/" + user.id}>
                                {user.first} {user.last}
                            </Link>
                        </li>
                    ))}
                    {!searchedUsersResults.length && searchedUser && (
                        <li>No users with this name</li>
                    )}
                </ul>
            )}
        </div>
    );
}
