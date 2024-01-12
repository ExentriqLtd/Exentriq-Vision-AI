import React, { Fragment, useState } from "react";
import type { NextPage } from "next";
import moment from "moment";
import { useRouter } from "next/router";
import { backendClient } from "~/api/backend";
import { session } from "~/config";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { HiMiniDocumentCheck } from 'react-icons/hi2';
import { FaUsers } from 'react-icons/fa6';
import { BiLoaderAlt } from "react-icons/bi";
import useIsMobile from "~/hooks/utils/useIsMobile";
import useIsTablet from "~/hooks/utils/useIsTablet";
import { HiDotsVertical } from "react-icons/hi";

interface CollectionItemInt {
    name?: string;
    created_at?: string;
    id?: string;
    doc_number: number;
    doc_processing: number;
    is_public: boolean;
    key?: string;
    toggleModal?: () => void;
    onRename?: (string: string) => void
    onIsPublic?: (bool: boolean) => void
    collectionId: string;
    dispatchVisionAI: (val: any) => void;
    toggleSidebar?: () => void;
    actualEvent?: EventSource;
}

const CollectionItem: NextPage<CollectionItemInt> = ({ name, actualEvent, created_at, id, is_public, toggleModal, toggleSidebar, doc_number, onRename, onIsPublic, dispatchVisionAI, collectionId, doc_processing }: CollectionItemInt) => {
    const router = useRouter()
    const { isMobile } = useIsMobile()
    const { isTablet } = useIsTablet()
    const [confirmDelete, setConfirmDelete] = useState(false)

    const openCollection = () => {
        toggleSidebar && toggleSidebar()
        if (actualEvent) {
            actualEvent?.close()
            dispatchVisionAI({ type: 'SET_STATUS_MESSAGE', payload: { messageStatus: '' } })
            dispatchVisionAI({ type: 'SET_ACTUAL_EVENT', payload: { actualEvent: null } })
        }
        dispatchVisionAI({ type: 'SET_COLLECTION_ACTIVE', payload: { collectionId: id } });
        dispatchVisionAI({type: 'SET_YODA_ACTIVE', payload: { isYodaSelected: false}});
        backendClient
            .createConversation(id)
            .then((newConversationId) => {
                router
                    .push({
                        pathname: `/conversation/${newConversationId}`,
                        query: session,
                    })
                    .catch(() => console.log("error navigating to conversation"));
            })
            .catch(() => console.log("error creating conversation "));
    }

    return (
        <div className={`bg-white shadow-md relative p-3 w-full flex flex-wrap my-2 cursor-pointer rounded-md border-2 ${(collectionId && collectionId == id) ? "border-primary-ex" : "border-transparent"}`} onClick={openCollection}>
            <div className="w-4/6">
                <div className="flex justify-between items-center w-full">
                    <div className="text-gray-400 text-xs">{moment(created_at).format('MMMM Do YYYY, h:mm a')}</div>
                </div>
                <div className="flex pt-1 justify-between items-center w-full">
                    <div className="flex gap-5 items-center">
                        <span>{name}</span>
                    </div>
                </div>
            </div>
            <div className="w-2/6 justify-end flex items-start">
                <div className="flex items-center gap-2">
                    {is_public && (
                        <div className="relative inline-block text-left">
                            <FaUsers color="#9BA3AF" size={20} />
                        </div>
                    )}
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button
                                onClick={(e) => {
                                    router
                                        .push({
                                            pathname: `/conversation/${id}`,
                                            query: session,
                                        })
                                        .catch(() => console.log("error navigating to conversation"));
                                    e.stopPropagation();
                                    setConfirmDelete(false);
                                    dispatchVisionAI({ type: 'SET_COLLECTION_ACTIVE', payload: { collectionId: id } });
                                    dispatchVisionAI({type: 'SET_YODA_ACTIVE', payload: { isYodaSelected: false}});
                                }}
                                className="inline-flex w-full cursor-pointer justify-center gap-x-1.5 rounded-full bg-white p-1 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                <HiDotsVertical color="#9BA3AF" size={18} />
                            </Menu.Button>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSidebar && toggleSidebar()
                                                    dispatchVisionAI({ type: 'SET_PDF_VIEWER', payload: { isPdfViewerOpen: false } })
                                                    dispatchVisionAI({ type: 'SET_GO_TO_UPLOAD', payload: { goToUpload: true } })
                                                    router.push({
                                                        pathname: `/`,
                                                        query: session,
                                                    })
                                                        .catch(() => console.log("error navigating to upload"))
                                                }}
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm'
                                                )}
                                            >
                                                Upload
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSidebar && toggleSidebar()
                                                    dispatchVisionAI({ type: 'SET_PDF_VIEWER', payload: { isPdfViewerOpen: false } })
                                                    router.push({
                                                        pathname: `/collection/${id}`,
                                                        query: session,
                                                    })
                                                        .catch(() => console.log("error navigating to conversation"))
                                                }}
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm'
                                                )}
                                            >
                                                Collection
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSidebar && toggleSidebar()
                                                    dispatchVisionAI({ type: 'SET_PDF_VIEWER', payload: { isPdfViewerOpen: false } })
                                                    toggleModal && toggleModal();
                                                    (onRename && name) && onRename(name)
                                                    onIsPublic && onIsPublic(is_public)
                                                }}
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm'
                                                )}
                                            >
                                                Modify
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <div>
                                                <a
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        dispatchVisionAI({ type: 'SET_PDF_VIEWER', payload: { isPdfViewerOpen: false } })
                                                        setConfirmDelete(true)
                                                    }}
                                                    className={classNames(
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                        'block px-4 py-2 text-sm'
                                                    )}
                                                >
                                                    Delete
                                                </a>
                                                {confirmDelete && (
                                                    <div
                                                        className={'block px-4 py-2 text-gray-900 text-sm border-t text-center'}
                                                    >
                                                        Are you sure you want to delete the collection?
                                                        <div className="flex mx-4 justify-between items-center pt-3">
                                                            <button
                                                                onClick={(e) => {
                                                                    toggleSidebar && toggleSidebar()
                                                                    backendClient.deleteCollection(collectionId)
                                                                        .then(() => {
                                                                            router
                                                                                .push({
                                                                                    pathname: `/`,
                                                                                    query: session,
                                                                                })
                                                                                .catch(() => console.log("error navigating to conversation"))
                                                                            dispatchVisionAI({ type: 'SET_DELETE_COLLECTION', payload: { uuid: collectionId } })
                                                                        }).catch(() => console.log('errore deleting collection'));
                                                                }}
                                                                type="button"
                                                                className={`${(isMobile || isTablet) && 'mr-2'} mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold color-primary-ex shadow-sm ring-1 ring-inset ring-primary-ex hover:bg-gray-50 sm:mt-0 sm:w-auto`}
                                                            >
                                                                Yes
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    toggleSidebar && toggleSidebar()
                                                                    setConfirmDelete(false)
                                                                }}
                                                                type="button"
                                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-400 shadow-sm ring-1 ring-inset ring-red-400 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
            {doc_number && (
                <div className="flex items-center w-full pt-1">
                    {doc_number === doc_processing ? (
                        <>
                            <div className="text-sm bg-primary-ex p-1 rounded-full"><HiMiniDocumentCheck color="#fff" size={12} /></div>
                            <div className="pl-1 text-gray-400 text-xs">{doc_number} document processed</div>
                        </>
                    ) : (
                        <>
                            <div className=""><BiLoaderAlt className="animate-spin" color="#1bbc9b" size={22} /></div>
                            <div className="pl-1 text-gray-400 text-xs">{doc_processing} out of {doc_number} document processed</div>
                        </>
                    )}

                </div>
            )}
        </div>
    );
};
export default CollectionItem;
