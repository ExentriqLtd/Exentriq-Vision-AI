import React from "react";

import type { NextPage } from "next";
import { useRouter } from "next/router";

const Yoda: NextPage = () => {
    const router = useRouter();

    const { sessionToken } = router.query;
    const formattedSessionToken = Array.isArray(sessionToken) ? sessionToken[0] : sessionToken;

    // formattedSessionToken = 'yJDYFjzJNvQdaGPXQMXTRLAswcGluonHngWboPpyXJKYIeaXYpztbTElsIDBkTqE';

    return (
        <div className="mx-6 w-4/5">
            <div className="w-full h-full">
            <iframe width={'100%'} height={'100%'} src={`https://talk.exentriq.com/chat/Yoda?sessionToken=${formattedSessionToken ?? ''}`}></iframe>
            </div>
        </div>
    );
};
export default Yoda;
