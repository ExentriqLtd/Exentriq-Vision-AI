import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";


const Collection: NextPage = () => {
    const router = useRouter();
    const { id, pippo } = router.query;
    return (
        <>
        <div>
            <p>{id}</p>
            <p>{pippo}</p>

        </div>
        </>
    );
};
export default Collection;
