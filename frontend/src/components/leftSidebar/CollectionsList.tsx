import React, { useEffect, useState } from "react";
import { backendClient } from "~/api/backend";
import { SecCollections } from "~/types/collections";

const CollectionList: React.FC = () =>  {
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
        <div className="w-[20vw]">
            {availableCollections.map((collection) => {
              return (
                <div
                  key={`collection-${collection.name}`}
                >
                  <div>{collection.name}</div>
                </div>
              );
            })}
        </div>
    );
};

export default CollectionList;