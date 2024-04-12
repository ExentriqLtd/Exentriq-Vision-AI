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
let embed;
let embedConvId;
let engine;

if (typeof window !== "undefined") {
    const queryString = window.location.search;
    const completeUrl = window.location.href;
    const urlParams = new URLSearchParams(queryString);
    
    spaceId = urlParams.get('spaceId') || "-1";
    username = urlParams.get('username') || "unknown";
    sessionToken = urlParams.get('sessionToken') || "empty";
    embed =  urlParams.get('embed') == "true";
    engine = urlParams.get('engine') || '';

    var idMatch = completeUrl.match(/\/conversation\/([a-f\d-]+)\?/i);
    embedConvId = idMatch ? idMatch[1] : null;
}

export const backendUrl = 'https://art001ai.exentriq.com/';
export const session = {
    username: username,
    spaceId: spaceId,
    sessionToken: sessionToken,
    embed: embed,
    embedConvId: embedConvId,
    engine: engine,
}

