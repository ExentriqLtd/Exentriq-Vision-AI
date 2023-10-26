import React from "react";
import type { NextPage } from "next";

interface FileUploadInt {
    file?: {
        lastEditedUtc?: number;
        lastModified?: number;
        filename?: string;
        status?: string;
    },
}

const FileUploaded: NextPage<FileUploadInt> = ({ file }: FileUploadInt) => {
    return (
        <>
            <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">{file?.filename?.substring(0, 20)} {file?.filename?.length >= 20 && '...'}</td>
            <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                <div className="flex flex-row items-center">
                    {(file?.status == 'failed') ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 text-red-500 h-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <circle cx="12" cy="12" r="6" />
                            </svg>
                            <p className="px-2">Failed</p>
                        </>
                    ) : (file?.status == 'success') ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 color-primary-ex h-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <circle cx="12" cy="12" r="6" />
                            </svg>
                            <p className="px-2">Success</p>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6  text-amber-400 h-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <circle cx="12" cy="12" r="6" />
                            </svg>
                            <p className="px-2">In progress...</p>
                        </>
                    )}
                </div>
            </td>
        </>
    );
};
export default FileUploaded;
