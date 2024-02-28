import { env } from "~/env.mjs";

if (env.NEXT_PUBLIC_CODESPACES === 'true' && env.NEXT_PUBLIC_CODESPACE_NAME) {
    const suggestedUrl = `https://${env.NEXT_PUBLIC_CODESPACE_NAME}-8000.app.github.dev/`;
    if (!env.NEXT_PUBLIC_BACKEND_URL.startsWith(suggestedUrl)) {
        console.warn(`It looks like you're running on a Github codespace. You may want to set the NEXT_PUBLIC_BACKEND_URL environment variable to ${suggestedUrl}`);
    }
}
let spaceId;
let username;
let sessionToken;

if (typeof window !== "undefined") {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    spaceId = urlParams.get('spaceId') || "-1";
    username = urlParams.get('username') || "unknown";
    sessionToken = urlParams.get('sessionToken') || "empty";
}

export const backendUrl = 'http://ais001exe.exentriq.com:30581/'; //config
export const session = {
    username: username,
    spaceId: spaceId,
    sessionToken: sessionToken
}

