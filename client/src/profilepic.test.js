import React from "react";
import ProfilePic from "./profilepic";
import { render, fireEvent } from "@testing-library/react";

test("When no profilePic is passed, /default-profile-pic.jpg is used as src", () => {
    const { container } = render(<ProfilePic />);
    expect(
        container.querySelector("img").src.endsWith("/default-profile-pic.jpg")
    ).toBe(true);
});

test("When a profilePic is passed as a prop, that profilePic is set as the src attribute", () => {
    const { container } = render(
        <ProfilePic profilePic="https://www.fillmurray.com/500/500" />
    );
    expect(container.querySelector("img").src).toBe(
        "https://www.fillmurray.com/500/500"
    );
});

test("When a first is passed as a prop, first is assigen as the value of the alt attribute", () => {
    const { container } = render(<ProfilePic first="first name" />);
    expect(container.querySelector("img").alt).toBe("first name");
});

test("toggleUploader props runs when the img is clickd", () => {
    const mockToggleUploader = jest.fn();
    const { container } = render(
        <ProfilePic toggleUploader={mockToggleUploader} />
    );
    fireEvent.click(container.querySelector("img"));
    expect(mockToggleUploader.mock.calls.length).toBe(1);
});
