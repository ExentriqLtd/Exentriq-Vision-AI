import React, { useEffect, useRef, useState } from "react";
import type { MessageSubProcess } from "~/types/conversation";
import { ROLE } from "~/types/conversation";
import { MESSAGE_STATUS } from "~/types/conversation";
import type { Citation } from "~/types/conversation";
import type { Message, SubQuestion } from "~/types/conversation";
import { LoadingSpinner } from "~/components/basics/Loading";
import { PiCaretDownBold } from "react-icons/pi";
import { HiOutlineChatAlt2 } from "react-icons/hi";

import { usePdfFocus } from "~/context/pdf";
import { AiFillExclamationCircle } from "react-icons/ai";
import type { SecDocument } from "~/types/document";
import { borderColors } from "~/utils/colors";
import { formatDisplayDate } from "~/utils/timezone";
import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'

interface CitationDisplayProps {
  citation: Citation;
}
const CitationDisplay: React.FC<CitationDisplayProps> = ({ citation }) => {
  const { setPdfFocusState } = usePdfFocus();
  //@ts-ignore
  const [stateVisionAI, dispatchVisionAI] = useVisionAI();
  const { isPdfViewerOpen } = stateVisionAI;
  var citationSnippet = citation.snippet.replace(/(```|-----)/g, '');


  const handleCitationClick = (documentId: string, pageNumber: number) => {
    dispatchVisionAI({ type: 'SET_PDF_VIEWER', payload: { isPdfViewerOpen: !isPdfViewerOpen } });
    setPdfFocusState({ documentId, pageNumber, citation });
  };

  return (
    <div
      className={`mx-1.5 mb-2 min-h-[25px] min-w-[160px] cursor-pointer rounded border-l-8 bg-gray-00 p-2 hover:bg-gray-15  ${borderColors['color-green-300']
        }`}
      onClick={() =>
        handleCitationClick(citation.documentId, citation.pageNumber)
      }
    >
      <div className="flex items-center">
        {/* <div className="mr-1 text-xs font-bold text-black">
          {citation.ticker}{" "}
        </div> */}
        <div className="mr-2 text-[14px] font-bold text-black">
          {citation.displayDate}
        </div>
        <div className="text-[12px]">p. {citation.pageNumber}</div>
      </div>
      <div className={`line-clamp-4 text-[14px] font-light leading-1-2 ${citationSnippet ? 'mt-2' : ''}`}>
        {citationSnippet}
      </div>
    </div>
  );
};

interface SubProcessDisplayProps {
  subProcesses: MessageSubProcess[];
  isOpen: boolean;
  toggleOpen: () => void;
  messageId: string;
  showSpinner: boolean;
  documents: SecDocument[];
}

type SubQuestionItem = {
  subQuestion: SubQuestion,
  subProcessIndex: number,
  subQuestionIndex: number
};

const SubProcessDisplay: React.FC<SubProcessDisplayProps> = ({
  subProcesses,
  isOpen,
  toggleOpen,
  messageId,
  documents,
  showSpinner = true,
}) => {
  const subQuestions: SubQuestionItem[] = [];
  subProcesses?.forEach((subProcess, subProcessIndex) => {
    if (subProcess.metadata_map?.sub_question) {
      subQuestions.push({
        subQuestion: subProcess.metadata_map?.sub_question,
        subProcessIndex,
        subQuestionIndex: subQuestions.length,
      });
    } else if (subProcess.metadata_map?.sub_questions) {
      subProcess.metadata_map?.sub_questions.forEach((subQuestion) => {
        subQuestions.push({
          subQuestion,
          subProcessIndex,
          subQuestionIndex: subQuestions.length,
        });
      });
    }
  });

  return (
    <div key={`${messageId}-sub-process`} className="mt-4 w-full rounded ">
      <div
        className="flex w-max cursor-pointer items-center rounded p-1 font-nunito text-gray-90 text-[16px] hover:bg-gray-00"
        onClick={() => toggleOpen()}
      >
        View progress
        <div className="px-3 py-2">
          {isOpen ? (
            <PiCaretDownBold />
          ) : (
            <PiCaretDownBold className="-rotate-90" />
          )}
        </div>
      </div>
      {isOpen && (
        <>
          <div className="ml-4 border-l border-l-gray-30 pb-1 pl-4 font-nunito text-[12px] font-light text-gray-60">
            <div>Question Received</div>
            {subQuestions.length > 0 && (
              <div
                key={`${messageId}-sub-process`}
                className="text-gray-60"
              >
                <div>
                  {subQuestions.map(({ subQuestion, subQuestionIndex, subProcessIndex }) => {
                    const hasCitations = !!subQuestion.citations;
                    return (
                      <div
                        key={`${messageId}-${subProcessIndex}-${subQuestionIndex}`}
                      >
                        Generated Sub Query #{subQuestionIndex + 1}{" "}
                        <div className="flex w-11/12 flex-col rounded border">
                          <div className="rounded-t border-b bg-gray-00 p-2 font-bold mb-2 text-gray-90">
                            {subQuestion.question}
                          </div>
                          {/* <div className="overflow-scroll p-2 text-[11px] font-light">
                            {subQuestion.answer}
                          </div> */}

                          {hasCitations && (
                            <div className=" mr-2 w-full pl-2 ">
                              {subQuestion.citations?.map(
                                (citation, citationIndex) => {
                                  // get snippet and dispaly date from documentId
                                  const citationDocument = documents.find(
                                    (doc) => doc.file_id === citation.document_id
                                  );
                                  if (!citationDocument) {
                                    return;
                                  }
                                  // const yearDisplay =
                                  //   citationDocument.quarter
                                  //     ? `${citationDocument.year} Q${citationDocument.quarter}`
                                  //     : `${citationDocument.year}`;
                                  return (
                                    <CitationDisplay
                                      key={`${messageId}-${subProcessIndex}-${subQuestionIndex}-${citationIndex}`}
                                      citation={
                                        {
                                          documentId: citation.document_id,
                                          uuid: citationDocument.uuid,
                                          snippet: citation.text,
                                          pageNumber: citation.pageNumber,
                                          ticker: citationDocument?.ticker,
                                          displayDate: citationDocument.filename,
                                          // color: citationDocument.color,
                                        } as Citation
                                      }
                                    />
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
            }
          </div>
          {showSpinner && (
            <div className="ml-2.5 mt-1 ">
              <LoadingSpinner />
            </div>
          )}
          <div className="pb-2"></div>
        </>
      )}
    </div>
  );
};


interface UserDisplayProps {
  message: Message;
  showLoading: boolean;
}
const UserDisplay: React.FC<UserDisplayProps> = ({ message, showLoading }) => {
  return (
    <>
      <div className="flex bg-gray-00 pb-4 pt-4 items-center">
        <div className="w-1/5 flex-grow text-right font-nunito text-gray-60">
          <div className="flex flex-col items-center justify-center">
            <div className="lineHeight20 text-[14px] font-semibold">
              {formatDisplayDate(message.created_at).formattedDate}
            </div>
            <div className="lineHeight20 text-[14px]">
              {formatDisplayDate(message.created_at).formattedTime}
            </div>
          </div>
        </div>
        <div className="w-4/5 pr-3 font-nunito font-bold text-gray-90 text-[18px] lineHeight30">
          {message.content}
        </div>
      </div>
      {message.errorUi && (
        <div className="flex pb-4">
          <div className="w-1/5"></div>
          <div className="w-4/5">
            <div className="text-red-500">Error, the request was not successful</div>
          </div>
        </div>
      )}
      {(showLoading && !message.errorUi) && (
        <div className="flex pb-4">
          <div className="w-1/5"></div>
          <div className="w-4/5">
            <SubProcessDisplay
              key={`${message.id}-loading-sub-process`}
              messageId={message.id}
              subProcesses={[]}
              isOpen={true}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              toggleOpen={() => { }}
              showSpinner={true}
              documents={[]}
            />
          </div>
        </div>
      )}
    </>
  );
};

const ErrorMessageDisplay = () => {
  return (
    <div className="mt-2 flex w-80 items-center rounded border border-red-500 bg-red-100 bg-opacity-20 p-1">
      <div className="ml-2">
        <AiFillExclamationCircle className="fill-red-500" size={20} />
      </div>
      <div className="ml-4 text-red-400">
        Error: unable to load chat response
      </div>
    </div>
  );
};

interface AssistantDisplayProps {
  message: Message;
  documents: SecDocument[];
  backToDetail?: boolean;
}
const AssistantDisplay: React.FC<AssistantDisplayProps> = ({
  message,
  backToDetail,
  documents,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  //@ts-ignore
  const [stateVisionAI, dispatchVisionAI] = useVisionAI()
  const { viewProgressActive } = stateVisionAI;
  const isMessageSuccessful = message.status === MESSAGE_STATUS.SUCCESS;
  const isMessageError = message.status === MESSAGE_STATUS.ERROR;

  useEffect(() => {
    if (message.status == MESSAGE_STATUS.PENDING) {
      dispatchVisionAI({ type: 'SET_STATUS_MESSAGE', payload: { messageStatus: message.status } })
    } else if (message.status === MESSAGE_STATUS.SUCCESS) {
      dispatchVisionAI({ type: 'SET_STATUS_MESSAGE', payload: { messageStatus: message.status } })
    } else if (message.status === MESSAGE_STATUS.ERROR) {
      dispatchVisionAI({ type: 'SET_STATUS_MESSAGE', payload: { messageStatus: message.status } })
    }
  }, [message.status])

  useEffect(() => {
    if (isMessageSuccessful) {
      dispatchVisionAI({ type: 'SET_VIEWPROGRESS_ACTIVE', payload: { viewProgressActive: message.uuid } })
      setIsExpanded(false);
    }
  }, [isMessageSuccessful]);

  useEffect(() => {
    if (message?.documents && isExpanded && !backToDetail) {
      dispatchVisionAI({ type: 'SET_VIEWPROGRESS_ACTIVE', payload: { viewProgressActive: message.uuid } })
      dispatchVisionAI({ type: 'SET_CITATION_DOCS', payload: { arrayCitDocs: message?.documents } })
    }
  }, [isExpanded])

  useEffect(() => {
    if (viewProgressActive !== message?.uuid) {
      setIsExpanded(false)
    }
  }, [viewProgressActive])
  
  return (
    <div className="border-b pb-4">
      <div className="flex ">
        <div className="w-1/5"></div>
        <div className="w-4/5">
          {!isMessageError && (
            <div className="flex flex-col">
              <SubProcessDisplay
                key={`${message.uuid}-sub-process`}
                subProcesses={message.sub_processes || []}
                isOpen={isExpanded}
                toggleOpen={() => {
                  dispatchVisionAI({ type: 'SET_VIEWPROGRESS_ACTIVE', payload: { viewProgressActive: message.uuid } })
                  setIsExpanded((prev) => !prev)
                }}
                showSpinner={!isMessageSuccessful}
                messageId={message.uuid}
                documents={documents}
              />
            </div>
          )}
          {isMessageError && <ErrorMessageDisplay />}
        </div>
      </div>

      {!isMessageError && (
        <>
          <div className="flex items-center justify-center">
            <div className="my-3 w-11/12 border-[.5px]"></div>
          </div>
          <div className="flex">
            <div className="w-1/5"></div>
            <div className="w-4/5">
              <div className="relative mb-2 mt-2 mr-416 font-nunito text-gray-90 text-[18px] markDownContainer">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </Markdown>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface IRenderConversation {
  messages: Message[];
  documents: SecDocument[];
  backToDetail?: boolean;
  messageStatus: string;
  actualEvent: EventSource;
  dispatchVisionAI: ({})=>{};
}

export const RenderConversations: React.FC<IRenderConversation> = ({
  backToDetail,
  messages,
  documents,
  messageStatus,
  actualEvent,
  dispatchVisionAI,
}) => {
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastElementRef.current) {
      lastElementRef.current.scrollIntoView();
    }
  }, [messages]);

  const showLoading = messages[messages.length - 1]?.role === ROLE.USER;
  return (
    <div className="box-border flex h-full flex-col justify-start font-nunito text-sm text-[#2B3175]">
      {messageStatus == 'PENDING' && (
        <div onClick={() => {
          actualEvent && actualEvent.close()
          dispatchVisionAI({ type: 'SET_STATUS_MESSAGE', payload: { messageStatus: '' } })
          dispatchVisionAI({ type: 'SET_ACTUAL_EVENT', payload: { actualEvent: null } })
        }} className="cursor-pointer absolute bottom-20 right-6 border py-2 px-6 rounded bg-white">
          Stop generating
        </div>
      )}
      {messages.map((message, index) => {
        let display;
        if (message.role == ROLE.ASSISTANT) {
          display = (
            <AssistantDisplay
              backToDetail={backToDetail}
              message={message}
              key={`${message.id}-answer-${index}`}
              documents={documents}
            />
          );
        } else if (message.role == ROLE.USER) {
          display = (
            <UserDisplay
              message={message}
              key={`${message.id}-question-${index}-user`}
              showLoading={index === messages.length - 1 ? showLoading : false}
            />
          );
        } else {
          display = <div>Sorry, there is a problem.</div>;
        }
        if (index === messages.length - 1) {
          return (
            <div className="flex flex-col" key={`message-${message.id}`}>
              {display}
            </div>
          );
        } else {
          return (
            <div className="flex flex-col" key={`${message.id}-${index}`}>
              {display}
            </div>
          );
        }
      })}
      {messages.length === 0 && (
        <div className="flex h-full items-center justify-center ">
          <div className="flex w-full flex-col items-center justify-center">
            <div>
              <HiOutlineChatAlt2 size={40} />
            </div>
            <div className="mb-2 w-3/4 text-center text-lg font-bold">
              Ask questions about the documents you&apos;ve
              selected.
            </div>
          </div>
        </div>
      )}
      <div ref={lastElementRef}></div>
    </div>
  );
};
