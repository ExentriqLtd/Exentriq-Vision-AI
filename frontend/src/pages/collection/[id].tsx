import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Header from "../section/header";
import FileUploaded from "./fileUploaded";
import { useUploadedFile } from "~/hooks/uploadedFile/useUploadFile";
import { Waypoint } from 'react-waypoint';
import { backendClient } from "~/api/backend";
import { session } from "~/config";
import { usePdfFocus } from "~/context/pdf";

const Collection: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    //@ts-ignore
    const [stateUploadedFile, dispatchUploadedFile] = useUploadedFile()
    const { setPdfFocusState } = usePdfFocus();
    const { arrayCollections, isPdfViewerOpen } = stateUploadedFile;
    const selectedCollection = arrayCollections?.filter((collection: any) => collection?.uuid == id)[0]
    const [limit, setLimit] = useState(50)
    const [documents, setDocuments] = useState<[] | null>(null)
    const [tableHeight, setTableHeight] = useState(0);


    useEffect(() => {
        dispatchUploadedFile({ type: 'SET_COLLECTION_ACTIVE', payload: { collectionId: id } });
        console.log('HEI', document.getElementsByClassName('getTableHeight')[0]?.clientHeight);
        setTableHeight(document.getElementsByClassName('getTableHeight')[0]?.clientHeight);
    }, [id])

    useEffect(() => {
        if (!id) return;
        //@ts-ignore
        backendClient.getCollectionDetails(id).then(({ result }: any) => {
            setDocuments(result?.documents)
        });
    }, [id]);
    const handleWaypointEnter = () => {
        setLimit(limit + 50)
    };
    const handleCitationClick = (documentId: string) => {
        dispatchUploadedFile({ type: 'SET_PDF_VIEWER', payload: { isPdfViewerOpen: !isPdfViewerOpen } });
        setPdfFocusState({
            documentId,
            pageNumber: 0,
            citation: {
                documentId: '',
                snippet: '',
                pageNumber: 0,
                ticker: '',
                displayDate: ''
            }
        });
        router
            .push({
                pathname: `/conversation/${id}`,
                query: { ...session, backToDetail: true },
            })
            .catch(() => console.log("error navigating to conversation"));
    };
    return (
        <>
            <div className="mt-3 mx-6 w-4/5 flex flex-col">
                <div className="flex flex-row items-center justify-between">
                    <Header title={'Collection'} subtitle={`${selectedCollection?.name}`} paragraph={false} />
                    <div className="flex flex-row items-center gap-3">
                        <button
                            onClick={() => {
                                router
                                    .push({
                                        pathname: `/conversation/${id}`,
                                        query: session,
                                    })
                                    .catch(() => console.log("error navigating to conversation"));
                            }}
                            className="
                            block 
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
                            Go to conversation
                        </button>
                        <button
                            onClick={() => {
                                console.log('goback');
                                dispatchUploadedFile({ type: 'SET_GO_TO_UPLOAD', payload: { goToUpload: true } })
                                router
                                    .push({
                                        pathname: `/`,
                                        query: session,
                                    })
                                    .catch(() => console.log("error navigating to conversation"))
                            }}
                            className="
                            block 
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
                </div>
                <div className="getTableHeight flex flex-col mt-3 my-6 relative shadow-md w-full bg-slate-50 rounded-md grow-1">
                    <div className="flex flex-col relative rounded-md">
                        <div className="h-full overflow-auto" style={{maxHeight: tableHeight}}>
                            <table className="relative border-collapse overflow-auto table-auto w-full text-sm shadow-sm rounded-md">
                                <thead>
                                    <tr>
                                        <th className="sticky top-0 bg-slate-50 border-b font-medium py-3 text-slate-400 text-left pl-8">Name</th>
                                        <th className="sticky top-0 bg-slate-50 border-b font-medium py-3 text-slate-400 text-left pl-8">Date</th>
                                        <th className="sticky top-0 bg-slate-50 border-b font-medium py-3 text-slate-400 text-left pl-8">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y bg-white">
                                    {(documents && documents?.length > 0) && documents.slice(0, limit + 1).map((file: object, index: number) => (
                                        <tr key={index}>
                                            <FileUploaded file={file} handleCitationClick={handleCitationClick} dispatchUploadedFile={dispatchUploadedFile} />
                                        </tr>
                                    ))}
                                    <Waypoint onEnter={handleWaypointEnter} />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    );
};
export default Collection;
