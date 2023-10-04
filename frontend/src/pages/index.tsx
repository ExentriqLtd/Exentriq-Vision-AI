import React, { useState } from "react";
import { useRouter } from "next/router";

import type { NextPage } from "next";
import DragAndDrop from "~/components/basics/DragAndDrop";
import { backendClient } from "~/api/backend";
import Header from "./header";

const LandingPage: NextPage = () => {

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const router = useRouter();

  const removeItem = (id: number) => {
    const filterd = uploadedFiles.filter((f) => f.lastModified !== id);
    setUploadedFiles(filterd);
  };

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
    const selectedDocumentIds: any = []; //TODO: passare gli uploaded files come se li aspetterà il servizio.
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
      {isLoadingConversation ?? (
        <div className="loading">LOADER</div>
      )}
      <div className="mt-3 mx-6 w-2/3">
        <Header title={'Welcome to the Exentriq'} subtitle={'Vision AI'} colorSubtitlePrimary={true} />
        <DragAndDrop onUpload={handleUpload} />
        {uploadedFiles.length > 0 && (
          <>
            <ul className="w-2/3 my-5">
              {uploadedFiles.map((file, index) => (
                <li
                  className="bg-white shadow-md px-5 py-3 w-full my-2 rounded-md"
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
                    <div className="flex flex-row">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 color-primary-ex h-6">
                        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                      </svg>
                      <p className="px-2">File uploaded</p>
                    </div>
                    <span
                      onClick={() => removeItem(file.lastModified)}
                      className=" cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 color-primary-ex h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-3 w-2/3 flex flex-col items-center">
          <p className="my-10">or</p>
        </div>
        {uploadedFiles.length > 0 ? (
          <button
            onClick={startConversation}
            className="
          block 
          w-2/3
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
            Let's go
          </button>
        ) : (
          <button
            onClick={() => router.push(`/chooseFromFolder/`)}
            className="
          w-2/3
          block 
          rounded-sm 
          bg-primary-ex 
          px-3.5 
          py-2.5 
          text-center 
          text-sm 
          text-white 
          shadow-md 
          mb-3
          hover:bg-primary-ex 
          focus-visible:outline 
          focus-visible:outline-2 
          focus-visible:outline-offset-2 
          focus-visible:outline-indigo-600">
            Choose from folder
          </button>
        )}
        {isUploading && (
          <progress value={uploadProgress} max="100"></progress> //TODO: so che Axios ha il progress ma non sono sicura che altri metodi lo abbiano. Vediamo come ci muoveremo per l'upload a sto punto e decidiamo se mettere questa o togliere il concetto di progress e lasciare solo la barra di loading alla exentriq (... che andrà fatta, per altro)
        )}
      </div>
      <div className="mt-3 w-1/3 flex flex-col items-end">
        <img src={'./bot-img.png'} className="w-80" alt="Google Drive Folder" />
      </div>
    </>
  );
};
export default LandingPage;
