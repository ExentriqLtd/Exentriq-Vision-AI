import React from "react";
import type { NextPage } from "next";
import moment from "moment";
import { HiOutlineDownload } from 'react-icons/hi'

export interface FileInt {
    file: {
        filename: string;
        created_at: string;
        status: string;
        url: string;
        uuid: string;
    };
    handleCitationClick: (id: string) => void
    dispatchVisionAI: (val: object) => void
}

const FileUploaded: NextPage<FileInt> = ({ file, handleCitationClick, dispatchVisionAI }: FileInt) => {
    const ext = file?.filename?.split(/[#?]/)[0]?.split('.')?.pop()?.trim() || '';
    const filename = file?.filename?.replace('.' + ext, '') || '';
    return (
        <>
            <td className="border-b border-slate-100 max-w-md p-4 text-slate-500">
                <div onClick={() => {
                    dispatchVisionAI({ type: 'SET_CITATION_DOCS', payload: { arrayCitDocs: [file] } })
                    handleCitationClick(file?.uuid)
                }}
                    className="color-primary-ex cursor-pointer line-clamp-2">
                    {filename}.{ext}
                </div>
            </td>
            <td className="border-b border-slate-100 p-4 text-slate-500">{moment(file?.created_at).format('MMMM Do YYYY, h:mm a')}</td>
            <td className="border-b border-slate-100 p-4 text-slate-500">
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
            <td className="border-b border-slate-100 p-4 text-slate-500">
                <a href={file?.url} target="_blank" className="flex cursor-pointer justify-start">
                    <HiOutlineDownload size={24} />
                </a>
            </td>
        </>
    );
};
export default FileUploaded;
