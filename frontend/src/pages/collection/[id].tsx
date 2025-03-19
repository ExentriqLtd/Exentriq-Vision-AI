import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Header from "../section/header";
import FileUploaded from "./fileUploaded";
import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";
import { Waypoint } from 'react-waypoint';
import { backendClient } from "~/api/backend";
import { session } from "~/config";
import { usePdfFocus } from "~/context/pdf";
import useIsMobile from "~/hooks/utils/useIsMobile";
import useIsTablet from "~/hooks/utils/useIsTablet";
import { useModal } from "~/hooks/utils/useModal";
import SummarizationModal from "~/components/modals/SummarizationModal";
import { IntSummarization } from "~/types/document";

const Collection: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    //@ts-ignore
    const [stateVisionAI, dispatchVisionAI] = useVisionAI()
    const { setPdfFocusState } = usePdfFocus();
    const { arrayCollections, isPdfViewerOpen } = stateVisionAI;
    const selectedCollection = arrayCollections?.filter((collection: any) => collection?.uuid == id)[0];
    const [limit, setLimit] = useState(50);
    const [documents, setDocuments] = useState<[] | null>(null);
    const [tableHeight, setTableHeight] = useState(0);
    const { isMobile } = useIsMobile();
    const { isTablet } = useIsTablet();
    const { isOpen: isSummarizationModalOpen, toggleModal: toggleSummarizationModal } = useModal();
    const [summarizationResult, setSummarizationResult] = useState('');

    useEffect(() => {
        dispatchVisionAI({ type: 'SET_COLLECTION_ACTIVE', payload: { collectionId: id } });
        dispatchVisionAI({type: 'SET_YODA_ACTIVE', payload: { isYodaSelected: false}});
        dispatchVisionAI({type: 'SET_PROMPTS_ACTIVE', payload: { isPromptsSelected: false}});
        setTableHeight(document.getElementsByClassName('getTableHeight')[0]?.clientHeight || 0);
    }, [id])

    useEffect(() => {
        if(session.embedConvId && session.embed) {
          dispatchVisionAI({ type: 'SET_COLLECTION_ACTIVE', payload: { collectionId: session.embedConvId } });
        }
    }, [session.embedConvId])

    const getCollectionDetails = (collectionID: string) => {
        backendClient.getCollectionDetails(collectionID)
        .then(({ result }: any) => {
            setDocuments(result?.documents)
        }).catch((e) => {
            console.log('e', e)
        })
    }

    useEffect(() => {
        if (!id) return;
        if (typeof id === 'string') {
            getCollectionDetails(id);
        }
    }, [id]);

    const handleWaypointEnter = () => {
        setLimit(limit + 50)
    };
    const handleCitationClick = (documentId: string) => {
        dispatchVisionAI({ type: 'SET_PDF_VIEWER', payload: { isPdfViewerOpen: !isPdfViewerOpen } });
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

    const dispatchSummarization = (documentID: string, collectionID: string, summarization_status: string) => {
        var reprocess;
        
        if (summarization_status == 'ERROR') {
            reprocess = true;
        } else {
            reprocess = false;
        }

        backendClient.fetchSummarization(documentID, reprocess, summarization_status, router, collectionID)
        .then((result: IntSummarization) => {
            var myTimeout;
            if(summarization_status == 'READY') {
                setSummarizationResult(result.summarization.values);
                toggleSummarizationModal();
            } else {
                if(result.status == 'IN PROGRESS') {
                    myTimeout = setTimeout(() => {
                        dispatchSummarization(documentID, collectionID, 'IN PROGRESS');
                    }, 5000);
                } else if(result.status == "ERROR") {
                    clearTimeout(myTimeout);
                    getCollectionDetails(collectionID);
                } else if(result.status == "READY") {
                    clearTimeout(myTimeout);
                    setSummarizationResult(result.summarization.values);
                    getCollectionDetails(collectionID);
                } else {
                    clearTimeout(myTimeout);
                }
            }
            
        }).catch((e) => {
            console.log('ERROR', e);
        })
    }
    return (
        <>
            <div className={`${(isMobile || isTablet || session.embed) ? 'w-full px-2' : 'w-4/5 mx-6'} flex flex-col`}>
                <div className={`${(!isMobile || !isTablet || session.embed) && 'flex flex-row'} items-center justify-between`}>
                    <Header subtitle={`${!session.embed ? selectedCollection?.name : ''}`} paragraph={false} />
                    <div className={`${(isMobile || isTablet || session.embed) && 'mt-4 mb-2'} flex flex-row items-center gap-3`}>
                        <button
                            onClick={() => {
                                router
                                    .push({
                                        pathname: `/conversation/${id}`,
                                        query: session,
                                    })
                                    .catch(() => console.log("error navigating to conversation"));
                            }}
                            className={`
                            block 
                            rounded-sm 
                            bg-primary-ex 
                            ${(isMobile || isTablet) ? (
                                    "px-2 py-2 text-xs"
                                ) : (
                                    "px-3.5 py-2.5 text-sm"
                                )}
                            text-center 
                            text-white 
                            shadow-md 
                            hover:bg-primary-ex 
                            focus-visible:outline 
                            focus-visible:outline-2 
                            focus-visible:outline-offset-2 
                            focus-visible:outline-indigo-600`}>
                            Go to conversation
                        </button>
                        {!session.embed &&
                            <button
                                onClick={() => {
                                    dispatchVisionAI({ type: 'SET_GO_TO_UPLOAD', payload: { goToUpload: true } })
                                    router
                                        .push({
                                            pathname: `/`,
                                            query: session,
                                        })
                                        .catch(() => console.log("error navigating to conversation"))
                                }}
                                className={`
                                block 
                                rounded-sm 
                                bg-primary-ex 
                                ${(isMobile || isTablet) ? (
                                        "px-2 py-2 text-xs"
                                    ) : (
                                        "px-3.5 py-2.5 text-sm"
                                    )}
                                text-center 
                                text-white 
                                shadow-md 
                                hover:bg-primary-ex 
                                focus-visible:outline 
                                focus-visible:outline-2 
                                focus-visible:outline-offset-2 
                                focus-visible:outline-indigo-600`}>
                                Go to upload
                            </button>
                        }
                    </div>
                </div>
                <div className={`${(!isMobile || !isTablet) && 'getTableHeight'} flex flex-col mt-3 my-6 relative shadow-md w-full bg-slate-50 rounded-md grow-1`}>
                    <div className="flex flex-col relative rounded-md">
                        <div className="h-full overflow-auto" style={{ maxHeight: (isMobile || isTablet) ? '100%' : tableHeight }}>
                            <table className="relative border-collapse overflow-auto table-auto w-full text-sm shadow-sm rounded-md">
                                <thead>
                                    <tr>
                                        <th className="sticky top-0 bg-gray-200 border-b font-medium py-3 text-gray-500 text-left p-4">Name</th>
                                        <th className="sticky top-0 bg-gray-200 border-b font-medium py-3 text-gray-500 text-left p-4">Date</th>
                                        <th className="sticky top-0 bg-gray-200 border-b font-medium py-3 text-gray-500 text-left p-4">Status</th>
                                        <th className="sticky top-0 bg-gray-200 border-b font-medium py-3 text-gray-500 text-left p-4">Download</th>
                                        <th className="sticky top-0 bg-gray-200 border-b font-medium py-3 text-gray-500 text-left p-4">Summarization</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y bg-white">
                                    {(documents && documents?.length > 0) && documents.slice(0, limit + 1).map((file: any, index: number) => (
                                        <tr key={index}>
                                            <FileUploaded collectionID={id || ''} file={file} handleCitationClick={handleCitationClick} dispatchVisionAI={dispatchVisionAI} dispatchSummarization={dispatchSummarization} />
                                        </tr>
                                    ))}
                                    <Waypoint onEnter={handleWaypointEnter} />
                                </tbody>
                            </table>
                        </div> 
                    </div>
                </div>

            </div>
            <SummarizationModal
                isOpen={isSummarizationModalOpen}
                toggleModal={toggleSummarizationModal}
                summarizationResult={summarizationResult}
            />
        </>
    );
};
export default Collection;
