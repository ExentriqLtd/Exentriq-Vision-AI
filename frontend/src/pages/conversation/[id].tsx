import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import DisplayMultiplePdfs from "~/components/pdf-viewer/DisplayMultiplePdfs";
import { backendUrl, session } from "src/config";
import { MESSAGE_STATUS } from "~/types/conversation";
import type { Message } from "~/types/conversation";
import useMessages from "~/hooks/useMessages";
import { backendClient } from "~/api/backend";
import { RenderConversations as RenderConversations } from "~/components/conversations/RenderConversations";
import { BiArrowBack, BiCurrentLocation } from "react-icons/bi";
import { SecDocument } from "~/types/document";
import { FiShare } from "react-icons/fi";
import ShareLinkModal from "~/components/modals/ShareLinkModal";
import { BsArrowUpCircle } from "react-icons/bs";
import { useModal } from "~/hooks/utils/useModal";
import { useIntercom } from "react-use-intercom";
import useIsMobile from "~/hooks/utils/useIsMobile";
import { useUploadedFile } from "~/hooks/uploadedFile/useUploadFile";

export default function Conversation() {
  const router = useRouter();
  const { id, backToDetail } = router.query;

  const { shutdown } = useIntercom();
  useEffect(() => {
    shutdown();
  }, []);

  const { isOpen: isShareModalOpen, toggleModal: toggleShareModal } =
    useModal();

  const { isMobile } = useIsMobile();
  // const [isPdfViewerOpen, setPdfViewer] = useState(false);
  const [stateUploadedFile, dispatchUploadedFile] = useUploadedFile();
  const { isPdfViewerOpen, arrayCitDocs } = stateUploadedFile;

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isMessagePending, setIsMessagePending] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<SecDocument[]>([]);

  const { messages, userSendMessage, systemSendMessage, setMessages } =
    useMessages(conversationId || "");

  const textFocusRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // router can have multiple query params which would then return string[]
    if (id && typeof id === "string") {
      setConversationId(id);
    }
  }, [id]);

  useEffect(() => {
    const fetchConversation = async (id: string) => {
      const result = await backendClient.fetchConversation(id);
      if (result.messages) {
        setMessages(result.messages);
      }
    };
    if (conversationId) {
      fetchConversation(conversationId).catch(() =>
        console.error("Conversation Load Error")
      );
    }
  }, [conversationId, setMessages]);


  useEffect(() => {
    if (arrayCitDocs.length > 0) {
      setSelectedDocuments(arrayCitDocs);
    }
  }, [arrayCitDocs])

  // Keeping this in this file for now because this will be subject to change
  const submit = () => {
    if (!userMessage || !conversationId) {
      return;
    }

    setIsMessagePending(true);
    userSendMessage(userMessage);
    setUserMessage("");

    const messageEndpoint =
      backendUrl + `api/conversation/${conversationId}/message`;
    const url = messageEndpoint + `?user_message=${encodeURI(userMessage)}&spaceId=${session.spaceId}&username=${session.username}&sessionToken=${session.sessionToken}`;
    console.log('URL----', url);
    const events = new EventSource(url);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    events.onmessage = (event: MessageEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      const parsedData: Message = JSON.parse(event.data);
      systemSendMessage(parsedData);

      if (
        parsedData.status === MESSAGE_STATUS.SUCCESS ||
        parsedData.status === MESSAGE_STATUS.ERROR
      ) {
        events.close();
        setIsMessagePending(false);
      }
    };
  };
  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(event.target.value);
  };
  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      if (textarea.style.height == '0px') {
        textarea.style.height = 'auto'
      }
    }
  }, [userMessage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (!isMessagePending) {
          submit();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [submit]);

  // const setSuggestedMessage = (text: string) => {
  //   setUserMessage(text);
  //   if (textFocusRef.current) {
  //     textFocusRef.current.focus();
  //   }
  // };

  useEffect(() => {
    if (textFocusRef.current) {
      textFocusRef.current.focus();
    }
  }, []);


  // if (isMobile) {
  //   return (
  //     <div className="landing-page-gradient-1 relative flex h-screen w-screen items-center justify-center">
  //       <div className="flex h-min w-3/4 flex-col items-center justify-center rounded border bg-white p-4">
  //         <div className="text-center text-xl ">
  //           Sorry, the mobile view of this page is currently a work in progress.
  //           Please switch to desktop!
  //         </div>
  //         <button
  //           onClick={() => {
  //             router
  //               .push({
  //                 pathname: `/`,
  //                 query: session,
  //               })
  //               .catch(() => console.log("error navigating to conversation"));
  //           }}
  //           className="m-4 rounded border bg-llama-indigo px-8 py-2 font-bold text-white hover:bg-[#3B3775]"
  //         >
  //           Back Home
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={`${isMobile ? 'w-full' : 'mx-6 w-4/5'}`}>
      <div className={`flex ${isMobile ? 'h-full' : 'h-[100vh]'} items-center w-full`}>
        <div className={`flex  ${isMobile ? 'h-full' : 'h-[100vh]'} flex-col items-center bg-white w-full`}>
          <div style={{ display: isPdfViewerOpen ? 'none' : 'block' }} className="w-full">

            {isMobile
              ? (
                <button
                  onClick={() => {
                    router.push({
                      pathname: `/collection/${id}`,
                      query: session,
                    })
                      .catch(() => console.log("error navigating to conversation"))
                  }}
                  className="
                    block 
                    absolute
                    top-2
                    right-2
                    rounded-sm 
                    bg-primary-ex 
                    px-2 
                    py-2 
                    text-center 
                    text-xs 
                    text-white 
                    shadow-md 
                    hover:bg-primary-ex 
                    focus-visible:outline 
                    focus-visible:outline-2 
                    focus-visible:outline-offset-2 
                    focus-visible:outline-indigo-600">
                  Collection detail
                </button>
              )
              : (
                <div className="flex h-[80px] w-full items-center justify-between">
                  <div className="flex w-full items-center justify-end p-2">
                    <button
                      onClick={() => {
                        router.push({
                          pathname: `/collection/${id}`,
                          query: session,
                        })
                          .catch(() => console.log("error navigating to conversation"))
                      }}
                      className="
                  block 
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
                      Collection detail
                    </button>
                  </div>
                </div>
              )}

            <div className="flex border h-[100vh] max-h-[calc(100vh-150px)] flex-grow flex-col overflow-scroll w-full">
              <RenderConversations
                backToDetail={backToDetail}
                messages={messages}
                documents={selectedDocuments}
              />
            </div>
            <div className="relative flex h-[70px] w-full items-center border border-t-0">
              <textarea
                ref={textFocusRef}
                rows={1}
                className="box-border w-full flex-grow resize-none overflow-hidden rounded px-5 py-3 pr-10 text-gray-90 placeholder-gray-60 outline-none"
                placeholder={"Start typing your question..."}
                value={userMessage}
                onChange={handleTextChange}
              />
              <button
                disabled={isMessagePending || userMessage.length === 0}
                onClick={submit}
                className="z-1 absolute right-6 top-1/2 mb-1 -translate-y-1/2 transform rounded text-gray-90 opacity-80 enabled:hover:opacity-100 disabled:opacity-30"
              >
                <BsArrowUpCircle size={24} />
              </button>
            </div>
          </div>
          <div style={{ display: isPdfViewerOpen ? 'block' : 'none' }} className="w-full">
            <DisplayMultiplePdfs pdfs={selectedDocuments} collectionId={id} backToDetail={backToDetail} />
          </div>
        </div>
        <ShareLinkModal
          isOpen={isShareModalOpen}
          toggleModal={toggleShareModal}
        />
      </div>
    </div>
  );
}
