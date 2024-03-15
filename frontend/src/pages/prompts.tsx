import React, { useEffect, useState } from "react";

import type { NextPage } from "next";
import useIsMobile from "~/hooks/utils/useIsMobile";
import useIsTablet from "~/hooks/utils/useIsTablet";
import Header from "./section/header";
import { backendClient } from "~/api/backend";
import { formatDate } from "~/utils/timezone";
import { MdEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import Modal from "~/components/basics/Modal";

const Prompts: NextPage = () => {
  const { isMobile } = useIsMobile();
  const { isTablet } = useIsTablet();
  const [tableHeight, setTableHeight] = useState(0);
  const [dataPrompt, setDataPrompt] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [insertItem, setInsertItem] = useState(null);

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
    setTableHeight(document.getElementsByClassName('getTableHeight')[0]?.clientHeight || 0);
  }, [])

  return (
    <>
      {editItem && (
        <Modal isOpen={editItem} toggleModal={() => { getPrompts(); setEditItem(null) }} title="Edit prompt" maxWidth="500px">
          <div className="flex items-center space-x-2">
            <textarea
              style={{ minHeight: 200, minWidth: 400 }}
              className="text-grey-darkest w-full border px-3 py-2"
              value={editItem.content}
              onChange={e => setEditItem({ ...editItem, content: e.target.value })}
            />
          </div>
          <div className="flex justify-end p-3">
            <button
              onClick={() => {
                backendClient.editPrompts(editItem.uuid, editItem.content)
                  .then(() => {
                    getPrompts();
                    setEditItem(null)
                  })
                  .catch((e) => {
                    console.log('error:::editPrompts', e)
                  })
              }}
              className="rounded bg-primary-ex px-4 py-2 font-bold text-white opacity-90 hover:opacity-100"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
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
      {deleteItem && (
        <Modal isOpen={deleteItem} toggleModal={() => { getPrompts(); setDeleteItem(null) }} title="Delete prompt" maxWidth="500px">
          <div
            className={'block px-4 py-2 text-gray-900 text-sm border-t text-center'}
          >
            Are you sure you want to delete the prompt?
            <div className="flex mx-4 justify-between items-center pt-3">
              <button
                onClick={(e) => {
                  backendClient.deletePrompts(deleteItem.uuid)
                    .then(() => {
                      getPrompts();
                      setDeleteItem(null)
                    })
                    .catch((e) => {
                      console.log('error:::editPrompts', e)
                    })
                }}
                type="button"
                className={`${(isMobile || isTablet) && 'mr-2'} mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold color-primary-ex shadow-sm ring-1 ring-inset ring-primary-ex hover:bg-gray-50 sm:mt-0 sm:w-auto`}
              >
                Yes
              </button>
              <button
                onClick={(e) => {
                  getPrompts();
                  setDeleteItem(null)
                }}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-400 shadow-sm ring-1 ring-inset ring-red-400 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className={`${(isMobile || isTablet) ? 'w-full px-2' : 'w-4/5 mx-6'} flex flex-col`}>
        <div className={`${(!isMobile || !isTablet) && 'flex flex-row'} items-center justify-between`}>
          <Header subtitle={'Prompts'} paragraph={false} />
          <div className={`${(isMobile || isTablet) && 'mt-4 mb-2'} flex flex-row items-center gap-3`}>
            <button
              onClick={() => {
                setInsertItem(true)
              }}
              className={`
                            block 
                            rounded-sm 
                            bg-primary-ex 
                            ${(isMobile || isTablet) ? (
                  "px-2 py-2 text-xs"
                ) : (
                  "px-3.5 py-2.5 text-sm"
                )}
                            text-center 
                            text-white 
                            shadow-md 
                            hover:bg-primary-ex 
                            focus-visible:outline 
                            focus-visible:outline-2 
                            focus-visible:outline-offset-2 
                            focus-visible:outline-indigo-600`}>
              Add prompt
            </button>
          </div>
        </div>
        <div className={`${(!isMobile || !isTablet) && 'getTableHeight'} flex flex-col mt-3 my-6 relative shadow-md w-full bg-slate-50 rounded-md grow-1`}>
          <div className="flex flex-col relative rounded-md">
            <div className="h-full overflow-auto" style={{ maxHeight: (isMobile || isTablet) ? '100%' : tableHeight }}>
              <table className="relative border-collapse overflow-auto table-auto w-full text-sm shadow-sm rounded-md">
                <thead>
                  <tr>
                    <th className="sticky top-0 bg-gray-200 border-b font-medium py-3 text-gray-500 text-left p-4">Content</th>
                    <th className="sticky top-0 bg-gray-200 border-b font-medium py-3 text-gray-500 text-left p-4">Created at</th>
                    <th className="sticky top-0 bg-gray-200 border-b font-medium py-3 text-gray-500 text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {(dataPrompt && dataPrompt?.length > 0) && dataPrompt.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="border-b border-slate-100 max-w-md p-4 text-slate-500">{item.content}</td>
                      <td className="border-b border-slate-100 max-w-md p-4 text-slate-500">{formatDate(item.created_at)}</td>
                      <td className="border-b border-slate-100 max-w-md p-4 text-slate-500">
                        <div className="flex">
                          <MdEdit className="mr-3" size={18} onClick={() => setEditItem({ uuid: item.uuid, content: item.content })} />
                          <MdOutlineDelete size={18} onClick={() => setDeleteItem({ uuid: item.uuid })} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </>
  );
};
export default Prompts;
