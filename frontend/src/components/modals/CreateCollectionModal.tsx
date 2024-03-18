import React, { useRef, useEffect, useState } from "react";
import Modal from "../basics/Modal";
import { isString } from "lodash";
import { backendClient, type CreateCollection, type RenameCollection } from "~/api/backend";
import { CiCirclePlus } from "react-icons/ci";

interface CreateCollectionModal {
  isOpen: boolean;
  isRename: string;
  is_public: boolean;
  toggleModal: () => void;
  createCollection: (val: CreateCollection) => void;
  renameCollection: (val: RenameCollection) => void;
}

const CreateCollectionModal: React.FC<CreateCollectionModal> = ({
  isOpen,
  isRename,
  toggleModal,
  createCollection,
  renameCollection,
  is_public,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState('');
  const [isOn, setIsOn] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [dataPrompt, setDataPrompt] = useState([]);
  const [dataAssistant, setDataAssistant] = useState([]);
  const [insertItem, setInsertItem] = useState(null);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.select();
    }
    is_public && setIsOn(is_public);
    if (isString(isRename) && isRename !== '') {
      setValue(isRename)
      setSelectedValue('')
    } else {
      setValue('')
      setIsOn(false);
      setSelectedValue('')
    }
  }, [isOpen, isRename, is_public]);

  const handleSelectChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  const getAssistant = () => {
    backendClient.getAssistant()
      .then((res) => {
        setDataAssistant(res)
      })
      .catch((e) => {
        console.log('error:::getAssistant', e)
      })
  }

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
    getAssistant()
  }, [])
  return (
    <>
      {insertItem && (
        <Modal isOpen={insertItem} toggleModal={() => { getPrompts(); setInsertItem(null) }} title="Add prompt" maxWidth="500px">
          <div className="flex items-center space-x-2">
            <textarea
              style={{ minHeight: 200, minWidth: 400 }}
              className="text-grey-darkest w-full border px-3 py-2"
              value={insertItem.content}
              onChange={e => setInsertItem({ content: e.target.value })}
            />
          </div>
          <div className="flex justify-end p-3">
            <button
              onClick={() => {
                backendClient.insertPrompts(insertItem.content)
                  .then(() => {
                    getPrompts();
                    setInsertItem(null)
                  })
                  .catch((e) => {
                    console.log('error:::insertPrompts', e)
                  })
              }}
              className="rounded bg-primary-ex px-4 py-2 font-bold text-white opacity-90 hover:opacity-100"
            >
              Add
            </button>
          </div>
        </Modal>
      )}
      <Modal isOpen={isOpen} toggleModal={toggleModal} title={isRename ? "Modify collection" : "Create new collection"} maxWidth="500px">
        <p className="mb-6 mt-2 text-sm text-gray-500">
          Enter the collection's info
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
              isRename
                ? renameCollection({ id: '', name: value, is_public: isOn })
                : createCollection(({ name: value, is_public: isOn }))
              setValue('')
            }}
            className="rounded bg-primary-ex px-4 py-2 font-bold text-white opacity-90 hover:opacity-100"
          >
            {isRename ? 'Save' : 'Create'}
          </button>
        </div>
        <div className="flex flex-row items-center mt-5">
          <div className="relative w-12 h-6 rounded-full bg-gray-200">
            <label htmlFor="toggle" className='absolute left-0 top-0 w-6 h-6 rounded-full cursor-pointer'>
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
                className={`absolute left-0 top-0 w-6 h-6 rounded-full shadow-md bg-white transform ${isOn ? 'hidden' : ''}`} />
            </label>
          </div>
          <div className="pl-3 text-sm text-gray-500">
            Visible to all users of the App
          </div>
        </div>
        <div className="flex flex-row items-center mt-5">
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={selectedValue}
            onChange={handleSelectChange}>
            <option selected value="">Select OpenAI Assistant</option>
            {(dataAssistant && dataAssistant?.length > 0) && dataAssistant.map((item: any, index: number) => {
              if(!item.name) return <></>
              return (
              <option key={index} value={item.id}>{item.name}</option>
            )})}
          </select>
        </div>
        {selectedValue && (
          <>
            <div className="flex flex-row items-center mt-5 pb-2">
              <label className="w-full text-sm text-gray-500">Select Prompts</label>
              <button
                onClick={() => {
                  setInsertItem(true)
                }}
                className={`
                block 
                color-primary-ex 
                text-center`}>
                <CiCirclePlus size={24} />
              </button>
            </div>
            <div className="flex flex-row items-center">
              <div className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-40" style={{ overflowY: 'auto' }}>
                {(dataPrompt && dataPrompt?.length > 0) && dataPrompt.map((item: any, index: number) => (
                  <ul style={{ listStyleType: 'none' }} key={index} className="p-0 text-sm font-medium text-gray-900 bg-white border-b border-gray-200 rounded-lge">
                    <li className="w-full">
                      <div className="flex items-center">
                        <input type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                        <label className="w-full py-2 ms-2 text-sm text-gray-900">{item?.content?.length > 50 ? item?.content.substring(0, 50) + '...' : item?.content}</label>
                      </div>
                    </li>
                  </ul>
                ))}
              </div>
            </div>

          </>
        )}
      </Modal>
    </>
  );
};

export default CreateCollectionModal;
