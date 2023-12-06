import React, { useRef, useEffect } from "react";
import Modal from "../basics/Modal";

interface SummarizationModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  summarizationResult: {
    values: string;
  };
}

const SummarizationModal: React.FC<SummarizationModalProps> = ({
  isOpen,
  toggleModal,
  summarizationResult
}) => {

  useEffect(() => {
    if (isOpen) {
      console.log('OPEN');
      console.log('eehehe', summarizationResult?.values);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} title="Summarization">
      <div className="">
        {summarizationResult?.values}
      </div>
    </Modal>
  );
};

export default SummarizationModal;
