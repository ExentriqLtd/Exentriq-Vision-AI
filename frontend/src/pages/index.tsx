import React, { useState } from "react";
import { useRouter } from "next/router";

import type { NextPage } from "next";
import DragAndDrop from "~/components/basics/DragAndDrop";
import { backendClient } from "~/api/backend";
import Header from "./section/header";
import FileUploaded from "./section/fileUploaded";

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
                <FileUploaded index={index} file={file} removeItem={removeItem} />
              ))}
            </ul>
          </>
        )}

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
          <>
            <div className="mt-3 w-2/3 flex flex-col items-center">
              <p className="my-10">or</p>
            </div>
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
          </>
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
