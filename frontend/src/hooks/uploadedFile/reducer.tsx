interface action {
    type: string;
    payload: any;
}

interface stateReducer {
    filesUploaded: [];
    arrayFileUploaded: [];
    arrayCitDocs: [];
    collectionId: string;
    arrayCollections: [];
    isPdfViewerOpen: boolean;
    viewProgressActive: string;
    toggleMenuMobile: boolean;
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
            const updatedArrayColl = state.arrayCollections.map((item) => {
                if (item.uuid === action?.payload?.collectionId) {
                    item.name = action?.payload?.name;
                }
                return item;
            });
            return {
                ...state,
                arrayCollections: updatedArrayColl
            };
        case 'SET_DELETE_COLLECTION':
            const filterTempColl = state?.arrayCollections?.filter((i: any) => i?.uuid !== action.payload.uuid)
            return {
                ...state,
                arrayCollections: filterTempColl
            };
        case 'SET_CITATION_DOCS':
            return {
                ...state,
                arrayCitDocs: action.payload?.arrayCitDocs
            };
        case 'SET_ARRAY_FILES':
            const file = action.payload?.filesUploaded
            const arrayUploaded = [
                ...state.arrayFileUploaded,
                file
            ]
            return {
                ...state,
                arrayFileUploaded: arrayUploaded
            };
        case 'SET_VIEWPROGRESS_ACTIVE':
            return {
                ...state,
                viewProgressActive: action?.payload?.viewProgressActive
            };
        case 'SET_REMOVE_FILES':
            const filterTemp = state?.arrayFileUploaded?.filter((i: any) => i?.lastModified !== action.payload.lastModified)
            return {
                ...state,
                arrayFileUploaded: filterTemp
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

export const initialState = {
    filesUploaded: null,
    arrayCollections: [],
    arrayCitDocs: [],
    collectionId: '',
    goToUpload: false,
    isPdfViewerOpen: false,
    viewProgressActive: '',
    toggleMenuMobile: false
};
