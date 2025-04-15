import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import moment from "moment";
import { HiOutlineDownload } from 'react-icons/hi'
import { MdErrorOutline, MdOutlineSummarize, MdSummarize } from "react-icons/md";
import { BiLoaderAlt } from "react-icons/bi";
import { LuListRestart } from "react-icons/lu";
import { FaFileCircleCheck } from "react-icons/fa6";
import { session } from "~/config";
import { backendClient } from "~/api/backend";

export interface FileInt {
    collectionID: string,
    file: {
        filename: string;
        created_at: string;
        status: string;
        url: string;
        uuid: string;
        file_id: string;
        summarization_status: string;
    };
    handleCitationClick: (id: string) => void;
    dispatchVisionAI: (val: object) => void;
    dispatchSummarization: (id: string, collectionID: string, summarization_status: string) => void;
}

const FileUploaded: NextPage<FileInt> = ({ collectionID, file, handleCitationClick, dispatchVisionAI, dispatchSummarization }: FileInt) => {
    const ext = file?.filename?.split(/[#?]/)[0]?.split('.')?.pop()?.trim() || '';
    const filename = file?.filename?.replace('.' + ext, '') || '';
    const summarization_status = file?.summarization_status || null;
    const [isSummarizing, setIsSummarizing] = useState(summarization_status);
    const [fileStatus, setFileStatus] = useState(file?.status);


    useEffect(() => {
        setIsSummarizing(summarization_status);
    }, [summarization_status]);

    const updateStatusFile = () => {
        if(!file.uuid) return;
        backendClient.getDetailFile(file.uuid)
          .then(({ result }: any) => {
            if (result?.status !== 'processed' &&  result?.status !== 'error') {
                setTimeout(() => {
                    updateStatusFile();
                }, 5000);
            } else {
                setFileStatus(result?.status);
            }
          }).catch((e) => {
            console.log('e.::::', e)
          })
    }

    useEffect(() => {
        if(fileStatus == 'processing') {
            updateStatusFile(); 
        }
    },[file.status])

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
                    {fileStatus == 'processed' ? (
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
                            <div className="px-2">File processed</div>
                        </>
                    ) : fileStatus == 'error' ? (  
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 color-error-ex h-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <circle cx="12" cy="12" r="6" />
                        </svg>
                        <div className="px-2">Processing error</div>
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
                            <div className="px-2">Processing...</div>
                        </>
                    )}
                </div>
            </td>
            <td className="border-b border-slate-100 p-4 text-slate-500">
                <a href={`${file?.url}?&spaceId=${session.spaceId || '-1'}&username=${session.username || 'unknown'}&sessionToken=${session.sessionToken || 'empty'}&engine=${session.engine || ''}`} target="_blank" className="flex cursor-pointer justify-start">
                    <HiOutlineDownload size={24} />
                </a>
            </td>
            <td className="border-b border-slate-100 p-4 text-slate-500">
                {(fileStatus !== 'error' && fileStatus !== 'processing') && (  
                <div onClick={() => {
                    if(summarization_status == null) {
                        setIsSummarizing('IN PROGRESS');
                    }
                    dispatchSummarization(file?.file_id, collectionID, summarization_status || ''); // Fornisco una stringa vuota come valore di default
                }} className="flex cursor-pointer justify-start align-center gap-1" style={{ color: (summarization_status === 'ERROR' ? 'red' : '') }}>
                    {isSummarizing == 'IN PROGRESS' ? (
                        <BiLoaderAlt className="animate-spin" color="#1bbc9b" size={22} />
                    ) : (
                        (summarization_status == null) ? (
                            <>
                                <LuListRestart size={24} />
                                Request
                            </>
                        ) : (summarization_status === 'ERROR' ? (
                            <>
                                <MdErrorOutline size={24} />
                                Restart
                            </>
                        ) : (
                            <>
                                <FaFileCircleCheck size={24} />
                                View
                            </>
                        ))
                        
                    )}
                </div>
                )}
            </td>
        </>
    );
};
export default FileUploaded;
