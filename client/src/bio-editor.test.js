import React from "react";
import BioEditor from "./bio-editor";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "./axios";

test("When no bio is passed, an 'Add Bio' button is rendered", () => {
    const { container } = render(<BioEditor />);
    expect(container.querySelector("button").innerHTML).toBe("Add Bio");
});

test("When a bio is passed, an 'Edit Bio' button is rendered.", () => {
    const { container } = render(<BioEditor bio="my bio" />);
    expect(container.querySelector("button").innerHTML).toBe("Edit Bio");
});

test("Clicking the 'Add Bio' button causes a textarea and a 'Update Bio' button to be rendered", () => {
    const { container } = render(<BioEditor />);
    fireEvent.click(container.querySelector("button"));
    expect(
        container.querySelector("div").innerHTML.indexOf("<textarea>")
    ).not.toBe(-1);
    expect(container.querySelector("button").innerHTML).toBe("Update Bio");
});

test("Clicking the 'Edit Bio' button causes a textarea and a 'Update Bio' button to be rendered", () => {
    const { container } = render(<BioEditor bio="my bio" />);
    fireEvent.click(container.querySelector("button"));
    expect(
        container.querySelector("div").innerHTML.indexOf("<textarea>")
    ).not.toBe(-1);
    expect(container.querySelector("button").innerHTML).toBe("Update Bio");
});

jest.mock("./axios");

axios.post.mockResolvedValue({
    data: {
        bio: "my bio",
    },
});

test("Clicking the 'Update Bio' button causes an ajax request. When the request is successful, the function that was passed as a prop to the component gets called", async () => {
    const mockUpdateBio = jest.fn();
    const { container } = render(<BioEditor updateBio={mockUpdateBio} />);
    fireEvent.click(container.querySelector("button"));
    fireEvent.click(container.querySelector("button"));
    await waitFor(() => {
        expect(mockUpdateBio.mock.calls.length).toBe(1);
    });
});
