import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Header from "../section/header";
import { collectionFile } from "./test";
import FileUploaded from "./fileUploaded";
import { useUploadedFile } from "~/hooks/uploadedFile/useUploadFile";
import { Waypoint } from 'react-waypoint';
import { backendClient } from "~/api/backend";

const Collection: NextPage = () => {
    const router = useRouter();
    const { id, name } = router.query;
    //@ts-ignore
    const [stateUploadedFile, dispatchUploadedFile] = useUploadedFile()
    const [limit, setLimit] = useState(50)

    useEffect(() => {
        dispatchUploadedFile({ type: 'SET_COLLECTION_ACTIVE', payload: { collectionId: id } })
        return () => {
            dispatchUploadedFile({ type: 'SET_COLLECTION_ACTIVE', payload: { collectionId: '' } })
        }
    }, [id])

    useEffect(() => {
        backendClient.getCollectionDetails('21393c08-684a-11ee-8145-e2a70e41aa24').then(() => {
            console.log('qui');
        });
    }, [id]);
    const handleWaypointEnter = () => {
        setLimit(limit + 50)
    };
    
    return (
        <>
            <div className="mt-3 mx-6 w-full">
                <Header title={'Collection'} subtitle={`${name}`} paragraph={false} />
                <div className="flex flex-col h-[80vh] mt-3 my-6 relative shadow-md w-full bg-slate-50 rounded-md">
                    <div className="rounded-md overflow-auto">
                        <table className="relative border-collapse overflow-auto table-auto w-full text-sm shadow-sm rounded-md">
                            <thead>
                                <tr>
                                    <th className="sticky top-0 bg-slate-50 border-b font-medium py-3 text-slate-400 text-left pl-8">Name</th>
                                    <th className="sticky top-0 bg-slate-50 border-b font-medium py-3 text-slate-400 text-left pl-8">Date</th>
                                    <th className="sticky top-0 bg-slate-50 border-b font-medium py-3 text-slate-400 text-left pl-8">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y bg-white">
                                {collectionFile.slice(0,limit + 1).map((file, index) => (
                                    <FileUploaded index={index} file={file} />
                                ))}
                                <Waypoint onEnter={handleWaypointEnter} />
                            </tbody>
                        </table>
                    </div>
                </div>
                <button
                    onClick={() => {
                        console.log('goback');
                        router.push(`/`)
                            .catch(() => console.log("error navigating to conversation"))
                    }}
                    className="
                    block 
                    w-full
                    rounded-sm 
                    bg-primary-ex 
                    px-3.5 
                    py-2.5 
                    text-center 
                    text-sm 
                    text-white 
                    shadow-md 
                    hover:bg-primary-ex 
                    focus-visible:outline 
                    focus-visible:outline-2 
                    focus-visible:outline-offset-2 
                    focus-visible:outline-indigo-600">
                    Go to upload
                </button>
            </div>
        </>
    );
};
export default Collection;