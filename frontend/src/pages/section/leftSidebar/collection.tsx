import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";


const Collection: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <>
        <div>
            <p>{id}</p>
        </div>
        </>
    );
};
export default Collection;
