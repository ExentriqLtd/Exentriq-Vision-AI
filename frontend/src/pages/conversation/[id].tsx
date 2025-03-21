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
import { SecDocument } from "~/types/document";
import ShareLinkModal from "~/components/modals/ShareLinkModal";
import { BsArrowUpCircle } from "react-icons/bs";
import { useModal } from "~/hooks/utils/useModal";
import { useIntercom } from "react-use-intercom";
import useIsMobile from "~/hooks/utils/useIsMobile";
import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";
import useIsTablet from "~/hooks/utils/useIsTablet";
import { v4 as uuidv4 } from "uuid";
import AssistantsModal from "~/components/modals/AssistantsModal";
import AssistantViewer from "~/components/assistant-viewer/AssistantViewer";


export default function Conversation() {
  const router = useRouter();
  const { id, backToDetail } = router.query;

  const { shutdown } = useIntercom();
  useEffect(() => {
    shutdown();
  }, []);

  const { isOpen: isShareModalOpen, toggleModal: toggleShareModal } =
    useModal();
  const { isOpen: isAssistantModalOpen, toggleModal: toggleAssistantModal } =
    useModal();
  const { isMobile } = useIsMobile();
  const { isTablet } = useIsTablet()
  // const [isPdfViewerOpen, setPdfViewer] = useState(false);
  //@ts-ignore
  const [stateVisionAI, dispatchVisionAI] = useVisionAI();
  const { isPdfViewerOpen, arrayCitDocs, isAssistantChatOpen, messageStatus, actualEvent } = stateVisionAI;

  const [conversationId, setConversationId] = useState<string | ''>('');
  const [isMessagePending, setIsMessagePending] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<SecDocument[]>([]);
  const [availableAgentOnSpaceId, setAvailableAgentOnSpaceId] = useState(false);

  const { messages, userSendMessage, systemSendMessage, setMessages, setErrorMessage } =
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
      if(result.agents.length > 0) {
        setAvailableAgentOnSpaceId(true);
      }

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

  useEffect(() => {
    if (!actualEvent && isMessagePending) {
      setIsMessagePending(false)
    }
  }, [actualEvent, isMessagePending])

  // Keeping this in this file for now because this will be subject to change
  const submit = () => {
    if (!userMessage || !conversationId) {
      return;
    }
    // console.log('userMessage:::.', userMessage)
    setIsMessagePending(true);
    const id = uuidv4()
    userSendMessage(userMessage, id);
    setUserMessage("");

    const messageEndpoint =
      backendUrl(session.spaceId) + `api/conversation_dev_2/${conversationId}/message`;
    const url = messageEndpoint + `?user_message=${encodeURI(userMessage)}&spaceId=${session.spaceId}&username=${session.username}&sessionToken=${session.sessionToken}&engine=${session.engine || ''}`;
    // console.log('URL----', url);
    const events = new EventSource(url);
    dispatchVisionAI({ type: 'SET_ACTUAL_EVENT', payload: { actualEvent: events } })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    events.onmessage = (event: MessageEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      const parsedData: Message = JSON.parse(event.data);
      // console.log("0...parsedData:::", parsedData)
      systemSendMessage(parsedData);

      if (
        parsedData.status === MESSAGE_STATUS.SUCCESS ||
        parsedData.status === MESSAGE_STATUS.ERROR
      ) {
        events.close();
        dispatchVisionAI({ type: 'SET_ACTUAL_EVENT', payload: { actualEvent: null } })
        setIsMessagePending(false);
      }
    };

    events.onerror = (event) => {
      events.close();
      dispatchVisionAI({ type: 'SET_ACTUAL_EVENT', payload: { actualEvent: null } })
      setIsMessagePending(false);
      setErrorMessage(id)
    }
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

  return (
    <div className={`${(isMobile || isTablet || session.embed) ? 'w-full' : 'mx-6 w-4/5'}`}>
      <div className={`flex ${(isMobile || isTablet || session.embed) ? 'h-full' : 'h-[100vh]'} items-center w-full`}>
        <div className={`flex  ${(isMobile || isTablet || session.embed) ? 'h-full' : 'h-[100vh]'} flex-col items-center bg-white w-full`}>
          <div style={{ display: (isPdfViewerOpen || isAssistantChatOpen) ? 'none' : 'block' }} className="w-full">

            <div className="flex h-[80px] w-full items-center justify-between">
              <div className="flex w-full items-center justify-end p-2">
                {availableAgentOnSpaceId && (
                  <button
                  onClick={toggleAssistantModal}
                  className="
                    block 
                    rounded-sm 
                    bg-primary-ex 
                    px-3.5 
                    py-2.5 
                    mr-2.5
                    text-center 
                    text-sm 
                    text-white 
                    shadow-md 
                    hover:bg-primary-ex 
                    focus-visible:outline 
                    focus-visible:outline-2 
                    focus-visible:outline-offset-2 
                    focus-visible:outline-indigo-600">
                  Agents
                </button>
                )}
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

            <div className="flex border h-[100vh] max-h-[calc(100vh-150px)] flex-grow flex-col overflow-scroll w-full">
              <RenderConversations
                //@ts-ignore
                backToDetail={backToDetail}
                messageStatus={messageStatus}
                dispatchVisionAI={dispatchVisionAI}
                messages={messages}
                actualEvent={actualEvent}
                documents={selectedDocuments}
              />
            </div>

            <div className="relative flex h-[70px] w-full items-center border border-t-0 customBoxShadow">
              <textarea
                ref={textFocusRef}
                rows={1}
                className="box-border w-full flex-grow resize-none overflow-hidden rounded px-5 py-3 pr-10 text-gray-90 placeholder-gray-60 outline-none border-0 focus:outline-none focus:ring-offset-0 focus:ring-0"
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
          <div style={{ display: isAssistantChatOpen ? 'block' : 'none' }} className="w-full h-full">
            <AssistantViewer/>
          </div>
          <div style={{ display: isPdfViewerOpen ? 'block' : 'none' }} className="w-full">
            {/* @ts-ignore */}
            <DisplayMultiplePdfs pdfs={selectedDocuments} collectionId={id} backToDetail={backToDetail} />
          </div>
        </div>
        <AssistantsModal
          isOpen={isAssistantModalOpen}
          conversationId={conversationId}
          toggleModal={toggleAssistantModal} />
        <ShareLinkModal
          isOpen={isShareModalOpen}
          toggleModal={toggleShareModal}
        />
      </div>
    </div>
  );
}
