import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

import { Typography, List, ListItem, Input } from "@material-ui/core";

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
        <div className="other-users">
            <Typography variant="h3">Find Other Users</Typography>
            {!searchedUsersResults && (
                <div className="newbies">
                    <Typography variant="h6">
                        Find out who just joind:
                    </Typography>
                    <List>
                        {lastRegistered.map((user, index) => (
                            <ListItem key={index} button>
                                <Link to={"/user/" + user.id}>
                                    <img
                                        src={
                                            user.profile_pic ||
                                            "../default-profile-pic.jpg"
                                        }
                                    />
                                </Link>
                                <Link to={"/user/" + user.id}>
                                    <Typography variant="body1">
                                        {user.first} {user.last}
                                    </Typography>
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                    {/* <ul>
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
                    </ul> */}
                </div>
            )}

            <div className="searched-users">
                <Typography variant="h6">
                    Are you looking for someone in particular?
                </Typography>
                <Input
                    onChange={(e) => setSearchedUser(e.target.value)}
                    type="text"
                    placeholder="Enter name"
                />

                {searchedUsersResults && (
                    <List>
                        {searchedUsersResults.map((user, index) => (
                            <ListItem key={index} button>
                                <Link to={"/user/" + user.id}>
                                    <img
                                        src={
                                            user.profile_pic ||
                                            "../default-profile-pic.jpg"
                                        }
                                    />
                                </Link>
                                <Link to={"/user/" + user.id}>
                                    <Typography variant="body1">
                                        {user.first} {user.last}
                                    </Typography>
                                </Link>
                            </ListItem>
                        ))}
                        {!searchedUsersResults.length && searchedUser && (
                            <ListItem>
                                <Typography variant="body1">
                                    No users with this name
                                </Typography>
                            </ListItem>
                        )}
                    </List>
                    // <ul>
                    //     {searchedUsersResults.map((user, index) => (
                    //         <li key={index}>
                    //             <Link to={"/user/" + user.id}>
                    //                 <img
                    //                     src={
                    //                         user.profile_pic ||
                    //                         "../default-profile-pic.jpg"
                    //                     }
                    //                 />
                    //             </Link>
                    //             <Link to={"/user/" + user.id}>
                    //                 {user.first} {user.last}
                    //             </Link>
                    //         </li>
                    //     ))}
                    //     {!searchedUsersResults.length && searchedUser && (
                    //         <li>No users with this name</li>
                    //     )}
                    // </ul>
                )}
            </div>
        </div>
    );
}
