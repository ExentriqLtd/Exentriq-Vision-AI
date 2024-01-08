import React, { useRef, useEffect } from "react";
import Modal from "../basics/Modal";

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
    <Modal isOpen={isOpen} toggleModal={toggleModal} title="Summarization">
      <div className="">
        {summarizationResult}
      </div>
    </Modal>
  );
};

export default SummarizationModal;
