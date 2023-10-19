import React, { useState } from "react";

import type { NextPage } from "next";
import useDrivePicker from 'react-google-drive-picker'
import Header from "./section/header";
import { useRouter } from "next/router";
import { useUploadedFile } from "~/hooks/uploadedFile/useUploadFile";
import { session } from "~/config";
import { generateUniqueId } from "~/utils/utility";
import { backendClient } from "~/api/backend";

const ChooseFromFolder: NextPage = () => {
  //@ts-ignore
  const [stateUploadedFile, dispatchUploadedFile] = useUploadedFile()
  const { collectionId } = stateUploadedFile;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [openPicker, authResponse] = useDrivePicker();
  const router = useRouter();

  const handleUpload = (files: File[]) => {
    try {
      files?.map((file) => {
        file.status = 'in progess'
        const uuId = generateUniqueId();
        file.id = uuId;
        dispatchUploadedFile({ type: 'SET_ARRAY_FILES', payload: { filesUploaded: file } });
        backendClient.uploadFileFromDrive(file, collectionId)
          .then((res) => {
            dispatchUploadedFile({ type: 'SET_ARRAY_FILES_STATUS', payload: { status: res?.status, id: uuId } });
          });
      })
    } catch (error) {
      console.log(error);
    } finally {
      // setIsUploading(false);
    }
  };

  const handleOpenPicker = () => {
    openPicker({
      clientId: "841515951225.apps.googleusercontent.com",
      developerKey: "AIzaSyApUTcsAu8uKlekoLbjT5L8GroNFYDkhuw",
      viewId: "DOCS",
      token: 'ya29.GlvsBm4Ds8sO8MHXPfQsrltV-ZvR0Toom68J_QdTrxmDr96QtXNThg57xazMIXT2hQpOkQPzSAOUBnN-b-pFRHwDbmAirmtsfpe9xoAJ0Ris3Cly0UEDnocMra09', // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // setIncludeFolders: true,
      setSelectFolderEnabled: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
        console.log('data::choose::',data)
        if (data?.docs) {
          const newData = data?.docs?.map((doc: any) => ({ ...doc, lastModified: doc?.lastEditedUtc }))
          handleUpload(newData)
          router
            .push({
              pathname: `/`,
              query: session,
            })
            .catch(() => console.log("error navigating to conversation"))
          dispatchUploadedFile({ type: 'SET_GO_TO_UPLOAD', payload: { goToUpload: true } })
        }
      },
    })
  }

  return (
    <>

      <div className="mt-3 mx-6 w-4/5 flex flex-col">
        <Header title={'Choose from other data source'} subtitle={'Data Sources'} paragraph={false} />
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
        {/* <div
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
        </div> */}
        <button
          onClick={() => router
            .push({
              pathname: `/`,
              query: session,
            })
            .catch(() => console.log("error navigating to conversation"))}
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
      {uploadProgress > 0 ?? (
        <progress value={uploadProgress} max="100"></progress>
      )}
    </>
  );
};
export default ChooseFromFolder;
