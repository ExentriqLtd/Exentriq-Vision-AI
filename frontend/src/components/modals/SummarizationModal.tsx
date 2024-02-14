import React, { useRef, useEffect } from "react";
import Modal from "../basics/Modal";
import Markdown from "react-markdown";

interface SummarizationModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  summarizationResult: string;
}

const SummarizationModal: React.FC<SummarizationModalProps> = ({
  isOpen,
  toggleModal,
  summarizationResult
}) => {

  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} title="Summarization" maxWidth="90vw">
      <div className="markDownContainer font-nunito text-gray-90 text-[18px] overflow-y-auto max-h-[calc(90vh-1rem)]">
        <Markdown>
          {summarizationResult}
        </Markdown>
      </div>
    </Modal>
  );
};

export default SummarizationModal;
