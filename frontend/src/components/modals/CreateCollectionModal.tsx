import React, { useRef, useEffect, useState } from "react";
import Modal from "../basics/Modal";
import { isString } from "lodash";

interface CreateCollectionModal {
  isOpen: boolean;
  isRename?: string;
  toggleModal: () => void;
  onClick: (val: string) => void;
}

const CreateCollectionModal: React.FC<CreateCollectionModal> = ({
  isOpen,
  isRename,
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

  useEffect(() => {
    if (isString(isRename) && isRename !== '') {
      setValue(isRename)
    }
  }, [isRename])


  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} title="Create new collection">
      <p className="mb-6 mt-2 text-sm text-gray-500">
        Enter the collection's name
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
          onClick={() => {
            onClick(value)
            setValue('')
          }}
          className="rounded bg-primary-ex px-4 py-2 font-bold text-white opacity-90 hover:opacity-100"
        >
          Create
        </button>
      </div>
    </Modal>
  );
};

export default CreateCollectionModal;
