interface action {
    type: string;
    payload: any;
}

interface stateReducer {
    filesUploaded: [];
    arrayFileUploaded: [];
    collectionId: string;
}
export const reducer = (state: stateReducer, action: action) => {
    switch (action.type) {
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
        case 'SET_ARRAY_FILES_STATUS':
            const status = action?.payload?.status;
            const idToUpdate = action?.payload?.id;
            const updatedArrayFileUploaded = state.arrayFileUploaded.map((item) => {
                if (item.id === idToUpdate) {
                    item.status = status;
                }
                return item;
            });

            return {
                ...state,
                arrayFileUploaded: updatedArrayFileUploaded
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
        default:
            return state;
    }
};

export const initialState = {
    filesUploaded: null,
    arrayFileUploaded: [],
    collectionId: '',
    goToUpload: false,
};
