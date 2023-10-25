import React, { Fragment, useState } from "react";
import type { NextPage } from "next";
import moment from "moment";
import { useRouter } from "next/router";
import { useUploadedFile } from "~/hooks/uploadedFile/useUploadFile";
import { backendClient } from "~/api/backend";
import { session } from "~/config";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { HiDocument } from 'react-icons/hi2';

interface CollectionItemInt {
    name?: string;
    created_at?: string;
    id?: string;
    doc_number: number;
    key?: string;
    toggleModal?: any;
    onRename?: (string: string) => {}
}

const CollectionItem: NextPage<CollectionItemInt> = ({ name, created_at, id, toggleModal, doc_number, onRename }: CollectionItemInt) => {
    const router = useRouter()
    //@ts-ignore
    const [stateUploadedFile, dispatchUploadedFile] = useUploadedFile()
    const { collectionId } = stateUploadedFile;
    const [confirmDelete, setConfirmDelete] = useState(false)

    const openCollection = () => {
        dispatchUploadedFile({ type: 'SET_COLLECTION_ACTIVE', payload: { collectionId: id } });
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
        <div className={`bg-white shadow-md px-5 relative py-3 w-full my-2 cursor-pointer rounded-md border-2 ${(collectionId && collectionId == id) ? "border-primary-ex" : "border-transparent"}`} onClick={openCollection}>
            <div className="flex justify-between items-center w-full">
                <p className="text-gray-300 text-xs">{moment(created_at).format('MMMM Do YYYY, h:mm a')}</p>
                <div className="flex flex-1 justify-end items-start w-full pr-1.5">
                    <p className="text-sm"><HiDocument color="#D6D9DF" /></p>
                    <p className="text-gray-300 text-xs">{doc_number}</p>
                </div>
            </div>
            <div className="flex pt-1 justify-between items-center w-full">
                <div className="flex gap-5 items-center">
                    <span>{name}</span>
                </div>
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button
                            onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete(false)
                                dispatchUploadedFile({ type: 'SET_COLLECTION_ACTIVE', payload: { collectionId: id } })
                            }}
                            className="inline-flex w-full cursor-pointer justify-center gap-x-1.5 rounded-full bg-white p-1 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                            </svg>
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
                                                dispatchUploadedFile({ type: 'SET_GO_TO_UPLOAD', payload: { goToUpload: true } })
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
                                                toggleModal();
                                                onRename(name)
                                            }}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            Rename
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <>
                                            <a
                                                onClick={(e) => {
                                                    e.stopPropagation();
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
                                                                e.stopPropagation();
                                                                backendClient.deleteCollection(collectionId)
                                                                    .then(() => {
                                                                        router
                                                                            .push({
                                                                                pathname: `/`,
                                                                                query: session,
                                                                            })
                                                                            .catch(() => console.log("error navigating to conversation"))
                                                                        dispatchUploadedFile({ type: 'SET_DELETE_COLLECTION', payload: { uuid: collectionId } })
                                                                    })
                                                            }}
                                                            type="button"
                                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold color-primary-ex shadow-sm ring-1 ring-inset ring-primary-ex hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                        >
                                                            Yes
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                console.log('onclick')
                                                                e.stopPropagation();
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
                                        </>
                                    )}

                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    );
};
export default CollectionItem;
