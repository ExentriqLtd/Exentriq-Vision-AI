import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import DragAndDrop from "~/components/basics/DragAndDrop";
import { backendClient } from "~/api/backend";
import Header from "./section/header";
import FileUploaded from "./section/fileUploaded";
import ProgressBar from "./section/progressBar";
import { useUploadedFile } from "~/hooks/uploadedFile/useUploadFile";
import { generateUniqueId } from "~/utils/utility";
import { session } from "~/config";
import useIsMobile from "~/hooks/utils/useIsMobile";
// import CreateCollectionModal from "~/components/modals/CreateCollectionModal";
// import { useModal } from "~/hooks/utils/useModal";

const LandingPage: NextPage = () => {
  //@ts-ignore
  const [stateUploadedFile, dispatchUploadedFile] = useUploadedFile()
  const { arrayFileUploaded, collectionId, goToUpload } = stateUploadedFile;
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { isMobile } = useIsMobile()

  const handleUpload = (files: File[]) => {
    try {
      setIsUploading(true);
      files?.map((file) => {
        backendClient.uploadFile(file, collectionId)
          .then(({ result }: any) => {
            dispatchUploadedFile({ type: 'SET_ARRAY_FILES', payload: { filesUploaded: result } });
          });
      })
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const startConversation = () => {
    setIsLoadingConversation(true);
    backendClient
      .createConversation(collectionId)
      .then((newConversationId) => {
        setIsLoadingConversation(false);
        router
          .push({
            pathname: `/conversation/${newConversationId}`,
            query: session,
          })
          .catch(() => console.log("error navigating to conversation"));
      })
      .catch(() => console.log("error creating conversation "));
  }

  useEffect(() => {
    dispatchUploadedFile({ type: 'SET_EMPTY_ARRAY_FILES' })
    return () => {
      dispatchUploadedFile({ type: 'SET_GO_TO_UPLOAD', payload: { goToUpload: false } })
    }
  }, [])



  return (
    <div className={`${isMobile ? 'w-full' : 'w-4/5'} flex flex-row`}>
      <div className="mt-3 mx-6 w-2/3 flex flex-col">
        {isLoadingConversation && (
          <ProgressBar />
        )}
        <Header
          title={'Welcome to the Exentriq'}
          subtitle={'Vision AI'}
          collectionId={collectionId}
          colorSubtitlePrimary={true} />
        {(collectionId && goToUpload) && (
          <>
            <DragAndDrop onUpload={handleUpload} />
            {/* <div className="my-6 w-2/3 flex flex-col items-center">
              <p>or</p>
            </div>
            <button
              onClick={() =>
                router
                  .push({
                    pathname: `/chooseFromFolder`,
                    query: session,
                  })
                  .catch(() => console.log("error navigating to conversation"))
              }
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
            </button> */}
            {arrayFileUploaded && arrayFileUploaded.length > 0 && (
              <>
                <div className={`${isMobile ? 'w-full' : 'w-2/3'} flex flex-col h-[30vh] mt-3 my-6 relative shadow-md bg-slate-50 rounded-md`}>
                  <div className="absolute inset-0 flex-grow overflow-auto bg-grid-slate-100" />
                  <div className="rounded-md overflow-auto">
                    <div className="shadow-sm">
                      <table className="relative border-collapse table-auto w-full text-sm">
                        <thead>
                          <tr>
                            <th className="sticky top-0 bg-slate-50 border-b font-medium py-3 text-slate-400 text-left pl-8">Name</th>
                            <th className="sticky top-0 bg-slate-50 border-b font-medium py-3 text-slate-400 text-left pl-8">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y bg-white">
                          {arrayFileUploaded.map((file: object, index: number) => (
                            <tr key={index}>
                              <FileUploaded key={index} file={file} />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-md dark:border-white/5" />
                </div>
                <button
                  onClick={startConversation}
                  className={`
                  block 
                  ${isMobile ? 'w-full' : 'w-2/3'}
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
                  focus-visible:outline-indigo-600`}>
                  Start conversation
                </button>
              </>
            )}
            {isUploading && (
              <progress value={uploadProgress} max="100"></progress> //TODO: Vediamo dove riusciamo a mettere la progress di upload. Magari sotto il form? In un posto che abbia senso. La chiamata però è da controllare se sia istantanea o meno provando magari a caricare files più pesanti?
            )}
          </>
        )}
      </div>
      <div className="mt-3 w-1/3 flex flex-col items-end">
        <img src={'./bot-img.png'} className="w-80" alt="Google Drive Folder" />
      </div>
    </div>
  );
};
export default LandingPage;
