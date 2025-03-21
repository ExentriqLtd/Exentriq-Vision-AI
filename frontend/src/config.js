import { env } from "~/env.mjs";

// Funzione asincrona per ottenere i valori dai parametri dell'URL
export async function getUrlParams() {
    // Simula il recupero dei valori dall'URL, ad esempio usando window.location.search
    const queryString = window.location.search;
    const completeUrl = window.location.href;
    const urlParams = new URLSearchParams(queryString);
    var idMatch = completeUrl.match(/\/conversation\/([a-f\d-]+)\?/i);
    var embedConvId = idMatch ? idMatch[1] || '' : '';

    // Aggiorna i valori di sessione con quelli ottenuti dall'URL
    session = {
        username: urlParams.get('username') || 'unknown',
        spaceId: urlParams.get('spaceId') || '-1',
        sessionToken: urlParams.get('sessionToken') || 'empty',
        ocr: urlParams.get('ocr') || '1',
        embed: urlParams.get('embed') === 'true',
        embedConvId: embedConvId,
        engine: urlParams.get('engine') || ''
    };
}

export function backendUrl(spaceId){
	// console.log(spaceId);
	if(spaceId == "96767"){
		return 'https://cmp001stg.exentriq.com/v2/';
	};
	return 'https://art001ai.exentriq.com/v2/';
}

if (env.NEXT_PUBLIC_CODESPACES === 'true' && env.NEXT_PUBLIC_CODESPACE_NAME) {
    const suggestedUrl = `https://${env.NEXT_PUBLIC_CODESPACE_NAME}-8000.app.github.dev/`;
    if (!env.NEXT_PUBLIC_BACKEND_URL.startsWith(suggestedUrl)) {
        console.warn(`It looks like you're running on a Github codespace. You may want to set the NEXT_PUBLIC_BACKEND_URL environment variable to ${suggestedUrl}`);
    }
}

export let session = {
    username: 'unknown',
    spaceId: '-1',
    sessionToken: 'empty',
    ocr: '1',
    embed: false,
    embedConvId: '',
    engine: '',
};
