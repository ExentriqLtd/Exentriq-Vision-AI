import React, { useState } from "react";
import type { NextPage } from "next";
import moment from "moment";
import { useRouter } from "next/router";
import { useUploadedFile } from "~/hooks/uploadedFile/useUploadFile";


const CollectionItem: NextPage = ({ index, name, created_at, id }: any) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false)
    const router = useRouter()
    //@ts-ignore
    const [stateUploadedFile] = useUploadedFile()
    const { collectionId } = stateUploadedFile;

    return (
        <>

            <li className={`bg-white shadow-md px-5 relative py-3 w-full my-2 rounded-md ${(collectionId && collectionId == id) ? "border-2 border-primary-ex" : ""}`} key={index}>
                <p className="text-gray-300 text-xs">{moment(created_at).format('MMMM Do YYYY, h:mm a')}</p>
                <div className="flex pt-1 justify-between items-center w-full">
                    <div className="flex gap-5 items-center">
                        <span>{name}</span>
                    </div>
                    <span
                        onClick={() => setIsMenuVisible(!isMenuVisible)}
                        className=" cursor-pointer  bg-gray-100 rounded-full p-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                        </svg>
                    </span>

                    {isMenuVisible && (
                        <div className="bg-white absolute right-0 top-16 text-right py-2 px-3 shadow-md text-sm" style={{ zIndex: 99 }}>
                            <p className="cursor-pointer"
                                onClick={() => {
                                    setIsMenuVisible(false)
                                    router.push({
                                        pathname: `/collection/${id}`,
                                        query: { name },
                                    })
                                        .catch(() => console.log("error navigating to conversation"))
                                }}>
                                Collection
                            </p>
                            <p className="cursor-pointer">Rename</p>
                            <p className="cursor-pointer">Delete</p>
                        </div>
                    )}
                </div>
            </li>
        </>
    );
};
export default CollectionItem;