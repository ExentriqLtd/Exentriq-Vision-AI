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
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.select();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isString(isRename) && isRename !== '') {
      setValue(isRename)
    } else {
      setValue('')
    }
  }, [isRename])


  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} title={isRename ? "Rename collection" : "Create new collection"}>
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
          {isRename ? 'Save' : 'Create'}
        </button>
      </div>
      <div className="flex flex-row items-center mt-5">
        <div className="relative w-12 h-6 rounded-full bg-gray-200">
          <label htmlFor="toggle" className={`absolute left-0 top-0 w-6 h-6 rounded-full cursor-pointer`}>
            <input
              type="checkbox"
              id="toggle"
              className="w-0 h-0 opacity-0"
              checked={isOn}
              onChange={toggleSwitch}
            />
            <span
              className={`absolute left-0 top-0 w-6 h-6 rounded-full shadow-md bg-primary-ex transform ${isOn ? 'translate-x-6 block' : 'hidden'}`} />
            <span
              className={`absolute left-0 top-0 w-6 h-6 rounded-full shadow-md bg-white transform ${isOn && 'hidden'}`} />
          </label>
        </div>
        <p className="pl-3 text-sm text-gray-500">
          Visible to all users of the App
        </p>
      </div>
    </Modal>
  );
};

export default CreateCollectionModal;
