import React, { useEffect, useState } from "react";
import { backendClient } from "~/api/backend";
import { SecCollections } from "~/types/collections";

const CollectionList: React.FC = () => {
  const [availableCollections, setAvailableCollections] = useState<SecCollections[]>([]);

  useEffect(() => {
    async function getCollections() {
      const collections = await backendClient.fetchCollections();
      console.log(collections);
      setAvailableCollections(collections);
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
      {availableCollections.map((collection) => {
        return (
          <div
            key={`collection-${collection.name}`}
          >
            <div>{collection.name}</div>
          </div>
        );
      })}
      <div className="absolute bottom-10 right-10 shadow-md bg-primary-ex w-10 h-10 rounded-full justify-center items-center">
        <p className="text-white pt-2 text-semibold text-center">+</p>
      </div>
    </div>
  );
};

export default CollectionList;