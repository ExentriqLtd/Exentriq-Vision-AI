import React, { useState } from "react";

import type { NextPage } from "next";
import useDrivePicker from 'react-google-drive-picker'
import Header from "./section/header";
import FileUploaded from "./section/fileUploaded";
import { isEmpty } from "lodash";
import { backendClient } from "~/api/backend";
import { useRouter } from "next/router";

const ChooseFromFolder: NextPage = () => {
  const [fileDrive, setFileDrive] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [openPicker, authResponse] = useDrivePicker();
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const router = useRouter();

  const handleOpenPicker = () => {
    openPicker({
      clientId: "841515951225-t0foo58s6s8jt6oafvgi0e9dcfn3e22i.apps.googleusercontent.com",
      developerKey: "AIzaSyApUTcsAu8uKlekoLbjT5L8GroNFYDkhuw",
      viewId: "DOCS",
      // token: token, // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
        setFileDrive(data?.docs)
      },
    })
  }
  const removeItem = (id: number) => {
    const filterd = fileDrive.filter((f) => f.lastEditedUtc !== id);
    setFileDrive(filterd);
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
      {!isEmpty(fileDrive) ? (
        <>
          <div className="mt-3 mx-6 w-2/3">
            {isLoadingConversation && (
              <div className="loading">LOADER</div>
            )}
            <Header title={'Welcome to the Exentriq'} subtitle={'Vision AI'} colorSubtitlePrimary={true} />
            <ul className="w-2/3 my-5">
              {fileDrive.map((file, index) => (
                <FileUploaded index={index} file={file} removeItem={removeItem} />
              ))}
            </ul>
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
          </div>
          <div className="mt-3 w-1/3 flex flex-col items-end">
            <img src={'./bot-img.png'} className="w-80" alt="Google Drive Folder" />
          </div>
        </>
      ) : (
        <div className="mt-3 mx-6 w-full">
          <Header title={'Choose from folder'} subtitle={'Data Sources'} paragraph={false} />
          <div
            className="
            block
            w-full
            rounded-md
            bg-white
            px-3.5
            py-2.5
            my-4
            text-left
            text-sm
            text-dark
            shadow-md
            flex
            items-center
            justify-between
            hover:bg-white
            focus-visible:outline
            focus-visible:outline-2
            focus-visible:outline-offset-2 
            focus-visible:outline-indigo-600">
            <div className="flex items-center">
              <img src={'./drive-folder.png'} className="w-10" alt="Google Drive Folder" />
              <p className="px-2">Google Drive</p>
            </div>
            <button className="underline" onClick={() => handleOpenPicker()}>Open folder</button>
          </div>
          <div
            className="
            block
            w-full
            rounded-md
            bg-white
            px-3.5
            py-2.5
            my-4
            text-left
            text-sm
            text-dark
            shadow-md
            flex
            items-center
            justify-between
            hover:bg-white
            focus-visible:outline
            focus-visible:outline-2
            focus-visible:outline-offset-2 
            focus-visible:outline-indigo-600">
            <div className="flex items-center">
              <img src={'./exentriq-folder.png'} className="w-10" alt="Google Drive Folder" />
              <p className="px-2">Exentriq Document Manager Folder</p>
            </div>
            <button className="underline" onClick={() => { }}>Open folder</button>
          </div>
        </div>
      )}
      {uploadProgress > 0 ?? (
        <progress value={uploadProgress} max="100"></progress>
      )}
    </>
  );
};
export default ChooseFromFolder;
