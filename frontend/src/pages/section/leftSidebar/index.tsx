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
import _ from 'lodash';

const CollectionList: React.FC = () => {
  const [newCollectionActive, setNewCollectionActive] = useState(false);
  const [isRename, setIsRename] = useState<String | undefined>(undefined);
  //@ts-ignore
  const [stateUploadedFile, dispatchUploadedFile] = useUploadedFile();
  const { collectionId, arrayCollections } = stateUploadedFile;
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter()

  async function getCollections(value: string) {
    const collections = await backendClient.fetchCollections(value);
    //@ts-ignore
    if (collections && collections?.result) {
      dispatchUploadedFile({ type: 'SET_ARRAY_COLLECTION', payload: { arrayCollections: collections?.result } })
    }
  }

  useEffect(() => {
    getCollections('').catch(() => console.error("could not fetch documents"));
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
        getCollections('')
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

  const handleSearchDebounced = _.debounce((value) => {
    if (value.length >= 3) {
      console.log('Eseguire la ricerca per:', value);
      getCollections(value);
    } 

    if(value.length == 0) {
      console.log('------> 0');
      getCollections('');
    }
  }, 1000); 


  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Avvia la ricerca con il debounce dopo almeno 3 caratteri
    handleSearchDebounced(value);
  };

  return (
    <>
      <CreateCollectionModal
        isOpen={isCollectionModalOpen}
        isRename={isRename}
        toggleModal={toggleCollectionModal}
        onClick={isRename ? renameCollection : createCollection}
      />
      <div className="w-1/5 bg-gray-100 relative p-4 rounded-l-lg flex flex-col">
        <input type="text" name="search" id="pricsearche"
          className="
           block 
           w-full 
           rounded-md
           shadow-md 
           border-0
           py-1.5 
           pl-3 
           pr-20 
           mb-5
           text-gray-900 
           placeholder:text-gray-400 
           sm:text-sm sm:leading-6"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
        /> 
        {isEmpty(arrayCollections) &&
          <p className="mt-6 text-gray-400 text-sm">There are no conversation yet you can start one <span className="color-primary-ex text-semibold underline cursor-pointer" onClick={toggleCollectionModal}>here</span> </p>
        }
        <ul className="containerScroll overflow-y-auto w-full h-full pb-5">
          {arrayCollections.map((collection, index) => {
            return (
              <li key={index}>
                <CollectionItem
                  name={collection?.name}
                  doc_number={collection?.doc_number}
                  created_at={collection?.created_at}
                  id={collection?.uuid}
                  toggleModal={toggleCollectionModal}
                  onRename={onRename}/>
              </li>
            );
          })}
        </ul>
        <div
          onClick={() => {
            setIsRename('');
            toggleCollectionModal();
          }}
          className="cursor-pointer absolute bottom-4 right-4 shadow-md bg-primary-ex w-10 h-10 rounded-full flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 text-white h-5">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>

        </div>
      </div>
    </>
  );
};

export default CollectionList;