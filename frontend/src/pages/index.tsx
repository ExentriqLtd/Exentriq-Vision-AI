import React, { useState } from "react";
import { useRouter } from "next/router";

import type { NextPage } from "next";
import { MarketingSection } from "~/components/landing-page/MarketingSection";
import { TitleAndDropdown } from "~/components/landing-page/TitleAndDropdown";
import axios from "axios";
import { backendUrl } from "~/config";
import { backendClient } from "~/api/backend";

const LandingPage: NextPage = () => {

  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const router = useRouter();

  const handleUpload = (event) => {
    setFile(event.target.files[0]);
    event.preventDefault();
    const url = backendUrl + 'api/upload'; //non funziona ma il concetto è questo
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
      onUploadProgress: function(progressEvent) {
        console.log('progress', progressEvent);
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      }
    };

    axios.post(url, formData, config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error uploading file: ", error);
      });

    console.log('procedo');

    setIsLoadingConversation(true);
    event.preventDefault();
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
      {/* <TitleAndDropdown /> */}
      <div className="mb-3 w-96">
          <label
            htmlFor="formFile"
            className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
          >
          Upload
          </label>
          <input
            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
            type="file"
           id="formFile"
           onChange={handleUpload}
          />
      </div>
      <progress value={uploadProgress} max="100"></progress>

      {/* <MarketingSection /> */}
    </>
  );
};
export default LandingPage;
