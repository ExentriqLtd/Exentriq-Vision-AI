import React from "react";
import type { NextPage } from "next";
import moment from "moment";

interface FileInt {
    file?: {
        filename?: string;
        created_at?: string;
        status?: string;
        url?: string;
    };
    key?: number;
}

const FileUploaded: NextPage<FileInt> = ({ file, key }: FileInt) => {
    return (
        <>
            <tr key={key}>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500"><a href={file?.url} download target={'_blank'} className="color-primary-ex">{file?.filename}</a></td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">{moment(file?.created_at).format('MMMM Do YYYY, h:mm a')}</td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                    <div className="flex flex-row items-center">
                        {file?.status == 'processed' ? (
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
                                <p className="px-2">File processed</p>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 text-amber-400 h-6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="6" />
                                </svg>
                                <p className="px-2">Processing...</p>
                            </>
                        )}
                    </div>
                </td>
            </tr>
        </>
    );
};
export default FileUploaded;
