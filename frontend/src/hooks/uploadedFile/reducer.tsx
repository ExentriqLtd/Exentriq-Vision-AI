export interface action {
    type: string;
    payload: {
        status: string,
        uuid: string,
        lastModified: string,
        arrayCollections: object,
        collectionId: string,
        name: string,
        arrayCitDocs: object,
        filesUploaded: {
            idTemp: string,
        },
        goToUpload: boolean,
        viewProgressActive: string,
        isPdfViewerOpen: boolean,
        isAssistantChatOpen: boolean,
        assistantResults: object,
        toggleMenuMobile: boolean,
        messageStatus: string,
        actualEvent: object | null,
        is_public: boolean,
        isYodaSelected: boolean,
        isPromptsSelected: boolean,
        filename: string,
        idTemp: string,
    };
}

export interface stateReducer {
    filesUploaded: [],
    arrayFileUploaded: Array<{ uuid?: string; statusUpload?: string, idTemp?: string, status?: string }>,
    arrayCitDocs: [],
    collectionId: string,
    arrayCollections: [],
    isPdfViewerOpen: boolean,
    isAssistantChatOpen: boolean,
    assistantResults: object,
    viewProgressActive: string,
    toggleMenuMobile: boolean,
    goToUpload: boolean,
    messageStatus: string,
    actualEvent: object | null,
    isYodaSelected: boolean,
    isPromptsSelected: boolean,
    uploadCompleted: string,
}

interface FileItem {
    lastModified: string,
    uuid: string,
    status: string,
    filename: string,
    idTemp: string,
}

interface Collection {
    uuid: string,
    name: string,
    is_public: boolean,
}

export const reducer = (state: stateReducer, action: action) => {
    switch (action.type) {
        case 'SET_OPEN_MENU_MOBILE':
            return {
                ...state,
                toggleMenuMobile: action.payload?.toggleMenuMobile
            };
        case 'SET_ARRAY_COLLECTION':
            return {
                ...state,
                arrayCollections: action.payload?.arrayCollections
            };
        case 'SET_RENAME_COLLECTION':
            const updatedArrayColl = state.arrayCollections.map((item: Collection) => {
                if (item.uuid === action?.payload?.collectionId) {
                    item.name = action?.payload?.name;
                    item.is_public = action?.payload?.is_public;
                }
                return item;
            });
            return {
                ...state,
                arrayCollections: updatedArrayColl
            };
        case 'SET_DELETE_COLLECTION':
            const filterTempColl = state?.arrayCollections?.filter((i: Collection) => i?.uuid !== action.payload.uuid)
            return {
                ...state,
                arrayCollections: filterTempColl
            };
        case 'SET_CITATION_DOCS':
            return {
                ...state,
                arrayCitDocs: action.payload?.arrayCitDocs
            };
        case 'SET_STATUS_MESSAGE':
            return {
                ...state,
                messageStatus: action.payload?.messageStatus
            };
        case 'SET_ACTUAL_EVENT':
            return {
                ...state,
                actualEvent: action.payload?.actualEvent
            };
        case 'SET_ARRAY_FILES':
            const newData = [
                ...state?.arrayFileUploaded,
                action.payload?.filesUploaded
            ]
            return { ...state, arrayFileUploaded: newData }
        case 'UPDATE_STATUS_UPLOAD_FILE':
            const fileTemp = state.arrayFileUploaded;
            const indexTemp = fileTemp.findIndex((file) => file.idTemp === action.payload?.filesUploaded.idTemp);
            if (indexTemp !== -1) {
                fileTemp[indexTemp] = action.payload?.filesUploaded;
            }
            return {
                ...state,
                arrayFileUploaded: fileTemp,
            };
        case 'UPDATE_STATUS_FILE':
            const actualArrayFile = state.arrayFileUploaded;
            const index = actualArrayFile.findIndex((file) => file.uuid === action.payload?.uuid);
            if (index !== -1) {
                actualArrayFile[index] = {...actualArrayFile[index], uuid: action.payload?.uuid || '', status: action.payload?.status || '' };
            }
            return {
                ...state,
                arrayFileUploaded: actualArrayFile,
            };
        case 'SET_UPLOAD_COMPLETED': 
            const uploadCompleted = action.payload?.idTemp;
            return {
                ...state,
                uploadCompleted,
            }
        case 'SET_VIEWPROGRESS_ACTIVE':
            return {
                ...state,
                viewProgressActive: action?.payload?.viewProgressActive
            };
        case 'SET_REMOVE_FILES':
            const filenameToRemove = action.payload.filename;
            const fileIdTemp = action.payload.idTemp;            
            const filterTemp = state?.arrayFileUploaded?.filter((fileItem) => {
                const file = fileItem as FileItem;
                return (file.filename !== filenameToRemove && file.idTemp !== fileIdTemp);
            });
            return {
                ...state,
                arrayFileUploaded: filterTemp || [],
            };
        case 'SET_COLLECTION_ACTIVE':
            return {
                ...state,
                collectionId: action?.payload?.collectionId
            };
        case 'SET_YODA_ACTIVE':
            return {
                ...state,
                isYodaSelected: action?.payload?.isYodaSelected
            };
        case 'SET_PROMPTS_ACTIVE':
            return {
                ...state,
                isPromptsSelected: action?.payload?.isPromptsSelected
            };
        case 'SET_EMPTY_ARRAY_FILES':
            return {
                ...state,
                arrayFileUploaded: []
            };
        case 'SET_GO_TO_UPLOAD':
            return {
                ...state,
                goToUpload: action?.payload?.goToUpload
            };
        case 'UPLOADEDFILE_RESET':
            return {
                ...initialState,
            };
        case 'SET_PDF_VIEWER':
            return {
                ...state,
                isPdfViewerOpen: action.payload.isPdfViewerOpen
            };
        case 'SET_ASSISTANT_VIEWER':
            return {
                ...state,
                isAssistantChatOpen: action.payload.isAssistantChatOpen,
                assistantResults: action.payload.assistantResults,
            };
        default:
            return state;
    }
};

export const initialState: stateReducer = {
    filesUploaded: [],
    arrayFileUploaded: [],
    arrayCollections: [],
    arrayCitDocs: [],
    collectionId: '',
    goToUpload: false,
    isPdfViewerOpen: false,
    isAssistantChatOpen: false,
    assistantResults: {},
    viewProgressActive: '',
    toggleMenuMobile: false,
    messageStatus: '',
    actualEvent: null,
    isYodaSelected: false,
    isPromptsSelected: false,
    uploadCompleted: ''
};

