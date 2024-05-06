import React, { useEffect } from "react";
import type { NextPage } from "next";
import { backendClient } from "~/api/backend";
import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";

export interface FileUploadInt {
    file: {
        lastEditedUtc: number;
        lastModified: number;
        filename: string;
        status: string;
        uuid: string;
        statusUpload: string,
    },
    statusUpload: string,
}

const TIMER = 1000

const FileUploaded: NextPage<FileUploadInt> = ({ file, statusUpload }: FileUploadInt) => {
    //@ts-ignore
    const [stateVisionAI, dispatchVisionAI] = useVisionAI()
    const { arrayFileUploaded } = stateVisionAI;

    const updateStatusFile = () => {
        if(!file.uuid) return;
        backendClient.getDetailFile(file.uuid)
          .then(({ result }: any) => {
            if (result?.status !== 'processed') {
                setTimeout(() => {
                    updateStatusFile();
                }, TIMER);
            } else {
                dispatchVisionAI({ type: 'UPDATE_STATUS_FILE', payload: { uuid: result.uuid, status: result.status } });
            }
          }).catch((e) => {
            console.log('e.::::', e)
          })
    }

    useEffect(() => {
        if(statusUpload == 'uploaded') {
            updateStatusFile(); 
        }
    },[statusUpload])

    return (
        <>
            <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">{file?.filename?.substring(0, 20)} {file?.filename?.length >= 20 && '...'}</td>
            <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                <div className="flex flex-row items-center">
                    {(file?.statusUpload == 'progress') ? (
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
                            <div className="px-2">In progress...</div>
                        </>
                    ) : (
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
                            <div className="px-2">Success</div>
                        </>
                    )}
                </div>
            </td>
            <td className="border-b border-slate-100 p-4 pl-8 text-slate-500">
                <div className="flex flex-row items-center">
                    {(file?.statusUpload == 'uploaded') && (
                        <>
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
                                    <div className="px-2">Failed</div>
                                </>
                            ) : (file?.status == 'processed') ? (
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
                                    <div className="px-2">Success</div>
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
                                    <div className="px-2">In progress...</div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </td>
        </>
    );
};
export default FileUploaded;
