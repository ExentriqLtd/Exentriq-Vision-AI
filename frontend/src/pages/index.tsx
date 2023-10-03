import React, { useState } from "react";
import { useRouter } from "next/router";

import type { NextPage } from "next";
import DragAndDrop from "~/components/basics/DragAndDrop";
import { backendUrl } from "~/config";
import { backendClient } from "~/api/backend";

const LandingPage: NextPage = () => {

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  const router = useRouter();

  const handleUpload = (files: File[]) => {
    try {
      setIsUploading(true);
      setUploadedFiles(uploadedFiles.concat(files));
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const startConversation = () => {
    setIsLoadingConversation(true);
    const selectedDocumentIds = [];
    backendClient
      .createConversation(selectedDocumentIds)
      .then((newConversationId) => {
        setIsLoadingConversation(false);
        router
          .push(`/conversation/${newConversationId}`)
          .catch(() => console.log("error navigating to conversation"));
      })
      .catch(() => console.log("error creating conversation "));
  }

  return (
    <>
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <DragAndDrop onUpload={handleUpload} />
        {uploadedFiles.length > 0 && (
          <>
          <ul className="w-2/3  my-5">
            {uploadedFiles.map((file, index) => (
              <li
                className="bg-sky-100 px-5 py-3 w-full my-2 rounded-lg"
                key={index}
              >
                <div className="flex justify-between items-center w-full">
                  {file.type.startsWith("image/") ? (
                    <div className="flex gap-5 items-center">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="avatar"
                        className="image-input-wrapper w-12 h-12 rounded-full cursor-pointer opacity-75-hover"
                      />
                      <span>{file.name}</span>
                    </div>
                  ) : (
                    <div className="flex gap-5 items-center">
                      <div className=" bg-gray-200  w-12 h-12 rounded-full cursor-pointer"></div>
                      <span>{file.name}</span>
                    </div>
                  )}
                  <span
                    onClick={() => removeItem(file.lastModified)}
                    className=" cursor-pointer"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        opacity="1"
                        x="6"
                        y="17.3137"
                        width="16"
                        height="2"
                        rx="1"
                        transform="rotate(-45 6 17.3137)"
                        fill="currentColor"
                      />
                      <rect
                        x="7.41422"
                        y="6"
                        width="16"
                        height="2"
                        rx="1"
                        transform="rotate(45 7.41422 6)"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <button
          onClick={startConversation}
          className="
          block 
          w-full 
          rounded-sm 
          bg-primary-ex 
          px-3.5 
          py-2.5 
          mb-3
          text-center 
          text-sm 
          text-white 
          shadow-md 
          hover:bg-primary-ex 
          focus-visible:outline 
          focus-visible:outline-2 
          focus-visible:outline-offset-2 
          focus-visible:outline-indigo-600">
          Let's go
        </button>
        </>
        )}
        {isUploading && (
          <div className="flex justify-center items-center w-1/3 h-48 border-2 border-dashed rounded-lg p-4">
            <p>Loading...</p>
          </div>
        )}
        <button
          onClick={() => router.push(`/chooseFromFolder/`)}
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
          Choose from folder
        </button>
    </div>
    </>
  );
};
export default LandingPage;
