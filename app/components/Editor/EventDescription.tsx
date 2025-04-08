"use client"
import { EventRequest, UpdateEventRequest } from "@/app/models/IEvents";
import dynamic from "next/dynamic";
import { Dispatch, FunctionComponent, ReactElement, SetStateAction } from "react";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface EventDescriptionEditorProps {
    description: string | undefined
    updateDescription: (value: string) => void
}

const EventDescriptionEditor: FunctionComponent<EventDescriptionEditorProps> = ({ description, updateDescription }): ReactElement => {
    const myColors = [
        "#8133f1",
        "#ceb0fa",
        "#efe6fd",
        "#f4f1f1",
        "#adadbc",
        "#fee755",
        "white"
    ];
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ align: ["right", "center", "justify"] }],
            [{ list: "ordered" }, { list: "bullet" }],
            // ["link", "image"],
            ["image"],
            [{ color: myColors }],
            [{ background: myColors }]
        ]
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        // "link",
        "color",
        "image",
        "background",
        "align"
    ];

    return (
        <>
            {/* {console.log(eventRequest?.description)} */}
            <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                value={description}
                onChange={(value) => updateDescription(value)}
                placeholder="Start by typing here..."
            />
        </>
    );
}

export default EventDescriptionEditor;