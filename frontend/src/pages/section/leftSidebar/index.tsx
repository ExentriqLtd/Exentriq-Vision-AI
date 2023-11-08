import React, { useEffect, useState } from "react";
import { backendClient } from "~/api/backend";
import type { CreateCollection, RenameCollection } from "~/api/backend";
import CollectionItem from "./collectionItem";
import { useModal } from "~/hooks/utils/useModal";
import CreateCollectionModal from "~/components/modals/CreateCollectionModal";
import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";
import { first, isEmpty } from "lodash";
import { useRouter } from "next/router";
import { session } from "~/config";
import { RxHamburgerMenu } from 'react-icons/rx'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import _ from 'lodash';
import useIsMobile from "~/hooks/utils/useIsMobile";
import useIsTablet from "~/hooks/utils/useIsTablet";

const CollectionList: React.FC = () => {
  const { isMobile } = useIsMobile()
  const { isTablet } = useIsTablet()
  const [newCollectionActive, setNewCollectionActive] = useState(false);
  const [isRename, setIsRename] = useState('');
  const [is_public, SetIs_public] = useState(false);
  //@ts-ignore
  const [stateVisionAI, dispatchVisionAI] = useVisionAI();
  const { collectionId, arrayCollections, actualEvent, toggleMenuMobile } = stateVisionAI;
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter()

  async function getCollections(value: string) {
    const collections = await backendClient.fetchCollections(value);
    //@ts-ignore
    if (collections && collections?.result) {
      //@ts-ignore
      dispatchVisionAI({ type: 'SET_ARRAY_COLLECTION', payload: { arrayCollections: collections?.result } })
      //@ts-ignore
      collections?.result?.map((item: any) => {
        if (item?.doc_number !== item?.doc_processing) {
          setTimeout(() => {
            getCollections(value)
          }, 1000);
        }
      })
    }
  }

  const toggleSidebar = () => {
    dispatchVisionAI({ type: 'SET_OPEN_MENU_MOBILE', payload: { toggleMenuMobile: !toggleMenuMobile } })
  };

  useEffect(() => {
    getCollections('').catch(() => console.error("could not fetch documents"));
  }, []);

  useEffect(() => {
    if (isEmpty(arrayCollections)) return;
    if (newCollectionActive) {
      const firstEl = first(arrayCollections);
      //@ts-ignore
      dispatchVisionAI({ type: 'SET_COLLECTION_ACTIVE', payload: { collectionId: firstEl?.uuid } })
      dispatchVisionAI({ type: 'SET_GO_TO_UPLOAD', payload: { goToUpload: true } })
      router
        .push({
          pathname: `/`,
          query: session,
        })
        .catch(() => console.log("error navigating to conversation"))
    }
  }, [arrayCollections])


  const { isOpen: isCollectionModalOpen, toggleModal: toggleCollectionModal } = useModal();

  const createCollection = ({ name, is_public }: CreateCollection) => {
    if (!name) return;
    setNewCollectionActive(true);
    backendClient.createCollection({ name, is_public })
      .then(() => {
        toggleCollectionModal()
        getCollections('')
      })
      .catch((e) => {
        console.log('e', e)
      })
  }

  const renameCollection = ({ name, is_public }: RenameCollection) => {
    if (!name) return;
    backendClient.renameCollection({ id: collectionId, name, is_public })
      .then(() => {
        toggleCollectionModal()
        dispatchVisionAI({ type: 'SET_RENAME_COLLECTION', payload: { collectionId, name, is_public } })
      })
      .catch((e) => {
        console.log('e', e)
      })
  }

  const onRename = (val: string) => {
    setIsRename(val)
  }

  const onIsPublic = (val: boolean) => {
    SetIs_public(val)
  }
  const handleSearchDebounced = _.debounce((value) => {
    if (value.length >= 3) {
      console.log('Eseguire la ricerca per:', value);
      getCollections(value);
    }

    if (value.length == 0) {
      getCollections('');
    }
  }, 1000);


  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Avvia la ricerca con il debounce dopo almeno 3 caratteri
    handleSearchDebounced(value);
  };

  const insideComponent = (
    <>
      <CreateCollectionModal
        isOpen={isCollectionModalOpen}
        is_public={is_public}
        isRename={isRename}
        toggleModal={toggleCollectionModal}
        renameCollection={renameCollection}
        createCollection={createCollection}
      />

      <div className={`${(isMobile || isTablet) ? 'w-full h-full' : 'w-1/5 bg-gray-100'} relative p-4 rounded-l-lg flex flex-col`}>
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
        <ul className="containerScroll overflow-y-auto w-full h-full pb-10">
          {arrayCollections.map((
            collection: {
              name: string | undefined;
              is_public: boolean;
              doc_number: number;
              doc_processing: number;
              created_at: string | undefined;
              uuid: string | undefined;
            },
            index: React.Key | null | undefined) => {
            return (
              <li key={index}>
                <CollectionItem
                  name={collection?.name}
                  is_public={collection?.is_public}
                  doc_number={collection?.doc_number}
                  doc_processing={collection?.doc_processing}
                  created_at={collection?.created_at}
                  actualEvent={actualEvent}
                  id={collection?.uuid}
                  toggleSidebar={toggleSidebar}
                  toggleModal={toggleCollectionModal}
                  dispatchVisionAI={dispatchVisionAI}
                  collectionId={collectionId}
                  onIsPublic={onIsPublic}
                  onRename={onRename} />
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
  )

  return (
    <>
      {(isMobile || isTablet) ? (
        <>
          <div className="p-2 mb-2 shadow-md">
            <button onClick={toggleSidebar} className="text-3xl cursor-pointer">
              <RxHamburgerMenu size={24} />
            </button>
          </div>
          <div className={`bg-gray-100 shadow-md h-full w-full fixed top-0 left-0 transform transition-transform ${toggleMenuMobile ? 'translate-x-0' : '-translate-x-full'}`} style={{ zIndex: 99 }}>
            <div className="p-4 flex justify-end">
              <button onClick={toggleSidebar} className="text-3xl cursor-pointer">
                <AiOutlineCloseCircle size={24} />
              </button>
            </div>
            <nav className="h-full">
              <div
                onClick={() => {
                  toggleSidebar()
                  setIsRename('');
                  toggleCollectionModal();
                }}
                style={{ zIndex: 99 }}
                className="cursor-pointer absolute bottom-4 right-4 shadow-md bg-primary-ex w-10 h-10 rounded-full flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 text-white h-5">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              </div>
              {insideComponent}
            </nav>
          </div>
        </>
      ) : (
        <>
          {insideComponent}
        </>
      )}
    </>
  );
};

export default CollectionList;