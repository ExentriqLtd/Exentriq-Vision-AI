import React, { useRef, useEffect, useState } from "react";
import Modal from "../basics/Modal";
import { backendClient } from "~/api/backend";
import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";

interface AssistantsModalProps {
  isOpen: boolean;
  toggleModal: () => void;
}

const AssistantsModal: React.FC<AssistantsModalProps> = ({
  isOpen,
  toggleModal,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dataPrompt, setDataPrompt] = useState([]);
  //@ts-ignore
  const [stateVisionAI, dispatchVisionAI] = useVisionAI();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.select();
    }
  }, [isOpen]);


  const getPrompts = () => {
    backendClient.getPrompts()
      .then((res) => {
        setDataPrompt(res)
      })
      .catch((e) => {
        console.log('error:::getPrompts', e)
      })
  }

  useEffect(() => {
    getPrompts()
  }, [])

  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} title="Agents" maxWidth="90vw">
      <div className="overflow-y-auto max-h-[calc(90vh-1rem)]">
        {(dataPrompt && dataPrompt?.length > 0) && dataPrompt.map((item: any, index: number) => (
          <div className="flex flex-row items-center justify-between border-b border-slate-100 p-4 gap-3">
            <div key={index} className="text-slate-500">{item.content}</div>
            <button
              onClick={() => {
                toggleModal();
                dispatchVisionAI({ type: 'SET_ASSISTANT_VIEWER', payload: { isAssistantChatOpen: true } })
              }}
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
              Execute
            </button>
          </div>

        ))}
      </div>
    </Modal>
  );
};

export default AssistantsModal;
