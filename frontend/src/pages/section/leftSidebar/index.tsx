import React, { useEffect, useState } from "react";
import { backendClient } from "~/api/backend";
import type { SecCollections } from "~/types/collections";
import CollectionItem from "./collectionItem";
import { useModal } from "~/hooks/utils/useModal";
import CreateCollectionModal from "~/components/modals/CreateCollectionModal";
import { useUploadedFile } from "~/hooks/uploadedFile/useUploadFile";
import { first, isEmpty } from "lodash";
import { useRouter } from "next/router";
import { session } from "~/config";

const CollectionList: React.FC = () => {
  const [newCollectionActive, setNewCollectionActive] = useState(false);
  const [isRename, setIsRename] = useState<String | undefined>(undefined);
  //@ts-ignore
  const [stateUploadedFile, dispatchUploadedFile] = useUploadedFile();
  const { collectionId, arrayCollections } = stateUploadedFile;
  const router = useRouter()

  async function getCollections() {
    const collections = await backendClient.fetchCollections();
    //@ts-ignore
    if (collections && collections?.result) {
      dispatchUploadedFile({ type: 'SET_ARRAY_COLLECTION', payload: { arrayCollections: collections?.result } })
    }
  }
  useEffect(() => {
    getCollections().catch(() => console.error("could not fetch documents"));
  }, []);

  useEffect(() => {
    if (isEmpty(arrayCollections)) return;
    if (newCollectionActive) {
      const firstEl = first(arrayCollections);
      dispatchUploadedFile({ type: 'SET_COLLECTION_ACTIVE', payload: { collectionId: firstEl?.uuid } })
      dispatchUploadedFile({ type: 'SET_GO_TO_UPLOAD', payload: { goToUpload: true } })
      router
        .push({
          pathname: `/`,
          query: session,
        })
        .catch(() => console.log("error navigating to conversation"))
    }
  }, [arrayCollections])


  const { isOpen: isCollectionModalOpen, toggleModal: toggleCollectionModal } = useModal();

  const createCollection = (name: string) => {
    if (!name) return;
    setNewCollectionActive(true);
    backendClient.createCollection(name)
      .then(() => {
        toggleCollectionModal()
        getCollections()
      })
  }

  const renameCollection = (name: string) => {
    if (!name) return;
    backendClient.renameCollection(collectionId, name)
      .then(() => {
        toggleCollectionModal()
        dispatchUploadedFile({ type: 'SET_RENAME_COLLECTION', payload: { collectionId, name } })
      })
  }

  const onRename = (val: string) => {
    setIsRename(val)
  }

  return (
    <>
      <CreateCollectionModal
        isOpen={isCollectionModalOpen}
        isRename={isRename}
        toggleModal={toggleCollectionModal}
        onClick={isRename ? renameCollection : createCollection}
      />
      <div className="w-1/5 bg-gray-100 relative p-4 rounded-l-lg flex flex-col">
        {/* <input type="text" name="search" id="pricsearche"
          className="
           block 
           w-full 
           rounded-md
           shadow-md 
           border-0
           py-1.5 
           pl-3 
           pr-20 
           text-gray-900 
           placeholder:text-gray-400 
           sm:text-sm sm:leading-6"
          placeholder="Search..." /> */}
        {isEmpty(arrayCollections) &&
          <p className="mt-6 text-gray-400 text-sm">There are no conversation yet you can start one <span className="color-primary-ex text-semibold underline cursor-pointer" onClick={toggleCollectionModal}>here</span> </p>
        }
        <ul className="containerScroll overflow-y-auto w-full mt-5 h-full pb-5">
          {arrayCollections.map((collection, index) => {
            return (
              <div key={index}>
                <CollectionItem
                  name={collection?.name}
                  created_at={collection?.created_at}
                  id={collection?.uuid}
                  toggleModal={toggleCollectionModal}
                  onRename={onRename}
                  getCollections={getCollections} />
              </div>
            );
          })}
        </ul>
        <div onClick={() => { setIsRename(''); toggleCollectionModal(); }} className="cursor-pointer absolute bottom-10 right-10 shadow-md bg-primary-ex w-10 h-10 rounded-full flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 text-white h-5">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>

        </div>
      </div>
    </>
  );
};

export default CollectionList;