import React from "react";
import type { NextPage } from "next";
import moment from "moment";


const FileUploaded: NextPage = ({ index, file }: any) => {
    return (
        <>
            <tr key={index}>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">{file.name}</td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">{moment(file?.lastModified).format('MMMM Do YYYY, h:mm a')}</td>
                <td className="border-b border-slate-100 p-4 text-slate-500">
                    <div className="flex flex-row">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 color-primary-ex h-6">
                            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                        </svg>
                        <p className="px-2">File uploaded</p>
                    </div>
                </td>
            </tr>
        </>
    );
};
export default FileUploaded;
