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
    <Modal isOpen={isOpen} toggleModal={toggleModal} title="Summarization" maxWidth="80vw">
      <div className="markDownContainer font-nunito whitespace-pre-wrap text-gray-90 text-[18px]">
        <Markdown>
          {summarizationResult}
        </Markdown>
      </div>
    </Modal>
  );
};

export default SummarizationModal;
