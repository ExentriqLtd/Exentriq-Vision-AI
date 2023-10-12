import React, { useRef, useEffect, useState } from "react";
import Modal from "../basics/Modal";

interface CreateCollectionModal {
  isOpen: boolean;
  toggleModal: () => void;
  onClick: () => void;
}

const CreateCollectionModal: React.FC<CreateCollectionModal> = ({
  isOpen,
  toggleModal,
  onClick,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.select();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} title="Share Conversation">
      <p className="mb-6 mt-2 text-sm text-gray-500">
       Testo
      </p>

      <div className="flex items-center space-x-2">
        <input
          ref={inputRef}
          className="text-grey-darkest w-full border px-3 py-2"
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <button
          onClick={() => onClick(value)}
          className="rounded bg-llama-indigo px-4 py-2 font-bold text-white opacity-90 hover:opacity-100"
        >
          Create
        </button>
      </div>
    </Modal>
  );
};

export default CreateCollectionModal;
