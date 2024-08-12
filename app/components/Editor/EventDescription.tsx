"use client"
import { EventRequest } from "@/app/models/IEvents";
import dynamic from "next/dynamic";
import { Dispatch, FunctionComponent, ReactElement, SetStateAction, useState } from "react";
// import ReactQuill from "react-quill";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface EventDescriptionEditorProps {
    description: string | undefined
    setEventRequest: Dispatch<SetStateAction<EventRequest | undefined>>
}

const EventDescriptionEditor: FunctionComponent<EventDescriptionEditorProps> = ({ description, setEventRequest }): ReactElement => {
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

    const handleProcedureContentChange = (content: any) => {
        setEventRequest((prev) => {
            return {
                ...prev!,
                description: content
            }
        });
    };

    return (
        <>
            {/* {console.log(eventRequest?.description)} */}
            <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                value={description}
                onChange={handleProcedureContentChange}
                placeholder="Start by typing here..."
            />
        </>
    );
}

export default EventDescriptionEditor;