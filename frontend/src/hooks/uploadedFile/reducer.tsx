export interface action {
    type: string;
    payload: {
        status: string;
        uuid: string,
        lastModified: string;
        arrayCollections: object;
        collectionId: string;
        name: string;
        arrayCitDocs: object,
        filesUploaded: object,
        goToUpload: boolean,
        viewProgressActive: string,
        isPdfViewerOpen: boolean,
        toggleMenuMobile: boolean,
        messageStatus: string,
        actualEvent: object | null,
        is_public: boolean,
    };
}

export interface stateReducer {
    filesUploaded: [];
    arrayFileUploaded: Array<{ uuid: string; status: string }>;
    arrayCitDocs: [];
    collectionId: string;
    arrayCollections: [];
    isPdfViewerOpen: boolean;
    viewProgressActive: string;
    toggleMenuMobile: boolean;
    goToUpload: boolean;
    messageStatus: string;
    actualEvent: object | null;
}

interface FileItem {
    lastModified: string;
    uuid: string;
    status: string;
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
        case 'SET_VIEWPROGRESS_ACTIVE':
            return {
                ...state,
                viewProgressActive: action?.payload?.viewProgressActive
            };
        case 'SET_REMOVE_FILES':
            const filterTemp = state?.arrayFileUploaded?.filter((i) => {
                const fileItem = i as FileItem;
                return fileItem.lastModified !== action.payload.lastModified;
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
    viewProgressActive: '',
    toggleMenuMobile: false,
    messageStatus: '',
    actualEvent: null
};

