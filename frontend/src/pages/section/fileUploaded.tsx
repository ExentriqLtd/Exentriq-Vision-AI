import React from "react";
import type { NextPage } from "next";

interface FileUploadInt {
    file?: {
        lastEditedUtc?: number;
        lastModified?: number;
        name?: string;
    },
}

const FileUploaded: NextPage<FileUploadInt> = ({ file }: FileUploadInt) => {

    return (
        <>
            <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">{file?.name}</td>
            <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">aggiungere icona con status</td>
        </>
    );
};
export default FileUploaded;
