import React, { useEffect, useState } from "react";
import { backendClient } from "~/api/backend";
import { SecCollections } from "~/types/collections";
import CollectionItem from "./collectionItem";

const CollectionList: React.FC = () => {
  const [availableCollections, setAvailableCollections] = useState<SecCollections[]>([]);

  useEffect(() => {
    async function getCollections() {
      const collections = await backendClient.fetchCollections();
      console.log('COLLECTIONS', collections);
      //TODO: perché result qui non gli piace a TS maledetto? L'ho cambiato il type!! -.-''
      setAvailableCollections(collections.result);
    }
    getCollections().catch(() => console.error("could not fetch documents"));
  }, []);

  return (
    <div className="w-96 bg-gray-100 relative p-4 rounded-l-lg">
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
           text-gray-900 
           placeholder:text-gray-400 
           sm:text-sm sm:leading-6"
        placeholder="Search..." />
      <p className="mt-6 text-gray-400 text-sm">There are no conversation yet you can start one <span className="color-primary-ex text-semibold underline">here</span> </p>
      <ul className="w-full my-5">
        {availableCollections.map((collection, index) => {
          return (
            <CollectionItem
              index={index}
              name={collection?.name}
              created_at={collection?.created_at}
              id={collection?.udid} />
          );
        })}
      </ul>
      <div className="absolute bottom-10 right-10 shadow-md bg-primary-ex w-10 h-10 rounded-full flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 text-white h-5">
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>

      </div>
    </div>
  );
};

export default CollectionList;