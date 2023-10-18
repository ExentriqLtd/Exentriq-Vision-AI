import React, { useEffect, useState } from "react";
import { backendClient } from "~/api/backend";
import type { SecCollections } from "~/types/collections";
import CollectionItem from "./collectionItem";
import { useModal } from "~/hooks/utils/useModal";
import CreateCollectionModal from "~/components/modals/CreateCollectionModal";
import { useUploadedFile } from "~/hooks/uploadedFile/useUploadFile";
import { first, isEmpty } from "lodash";
import { useRouter } from "next/router";

const CollectionList: React.FC = () => {
  const [availableCollections, setAvailableCollections] = useState<SecCollections[]>([]);
  const [newCollectionActive, setNewCollectionActive] = useState(false);
  //@ts-ignore
  const [stateUploadedFile, dispatchUploadedFile] = useUploadedFile();
  const router = useRouter()

  async function getCollections() {
    const collections = await backendClient.fetchCollections();
    //@ts-ignore
    (collections && collections?.result) && setAvailableCollections(collections?.result);
  }
  useEffect(() => {
    getCollections().catch(() => console.error("could not fetch documents"));
  }, []);

  useEffect(() => {
    if (isEmpty(availableCollections)) return;
    if (newCollectionActive) {
      console.log('prova', first(availableCollections));
      const firstEl = first(availableCollections);
      dispatchUploadedFile({ type: 'SET_COLLECTION_ACTIVE', payload: { collectionId: firstEl?.uuid } })
      router
        .push(`/`)
        .catch(() => console.log("error navigating to conversation"))
    }
  }, [availableCollections])


  const { isOpen: isCollectionModalOpen, toggleModal: toggleCollectionModal } = useModal();

  const createCollection = (name: string) => {
    if (!name) return;
    setNewCollectionActive(true)
    backendClient.createCollection(name)
      .then(() => {
        toggleCollectionModal()
        getCollections()
      })
  }
  return (
    <>

      <CreateCollectionModal
        isOpen={isCollectionModalOpen}
        toggleModal={toggleCollectionModal}
        onClick={createCollection}
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
        {isEmpty(availableCollections) &&
          <p className="mt-6 text-gray-400 text-sm">There are no conversation yet you can start one <span className="color-primary-ex text-semibold underline cursor-pointer" onClick={toggleCollectionModal}>here</span> </p>
        }
        <ul className="containerScroll overflow-y-auto w-full mt-5 h-full pb-5">
          {availableCollections.map((collection, index) => {
            return (
              <div key={index}>
                <CollectionItem
                  name={collection?.name}
                  created_at={collection?.created_at}
                  id={collection?.uuid} />
              </div>
            );
          })}
        </ul>
        <div onClick={toggleCollectionModal} className="cursor-pointer absolute bottom-10 right-10 shadow-md bg-primary-ex w-10 h-10 rounded-full flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 text-white h-5">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>

        </div>
      </div>
    </>
  );
};

export default CollectionList;