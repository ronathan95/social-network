import { Component } from "react";
import axios from "./axios";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
        };
    }

    componentDidMount() {
        //make an axios request to get the other user's data - this.props.match.params.id
        // if this.props.match.params.id equals the current user's id - should redirect to / route, this.props.history.push("/") (== and not ===)
        console.log("this.props.id: ", this.props.id);
    }

    render() {
        return (
            <div>
                <h1>OtherProfile</h1>
            </div>
        );
    }
}
