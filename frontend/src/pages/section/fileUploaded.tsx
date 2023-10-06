import React from "react";
import type { NextPage } from "next";


const FileUploaded: NextPage = ({ index, file, removeItem }: any) => {
    const lastModified = (file?.lastModified || file?.lastEditedUtc)

    return (
        <>
            <tr key={index}>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">{file.name}</td>
                <td className="border-b border-slate-100 p-4 text-slate-500">
                    <div className="flex flex-row">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 color-primary-ex h-6">
                            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                        </svg>
                        <p className="px-2">File uploaded</p>
                    </div>
                </td>
                <td className="border-b border-slate-100 p-4 pl-10 text-slate-500">
                    <span
                        onClick={() => removeItem(lastModified)}
                        className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 color-primary-ex h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </span>
                </td>
            </tr>
        </>
    );
};
export default FileUploaded;
