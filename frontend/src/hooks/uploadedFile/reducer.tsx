interface action {
    type: string;
    payload: any;
}

interface stateReducer {
    filesUploaded: [];
    arrayFileUploaded: [];
    idCollection: string;
}
export const reducer = (state: stateReducer, action: action) => {
    switch (action.type) {
        case 'SET_ARRAY_FILES':
            const file = action.payload?.filesUploaded
            const arrayUploaded = [
                ...state.arrayFileUploaded,
                ...file
            ]
            return {
                ...state,
                arrayFileUploaded: arrayUploaded
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
                idCollection: action?.payload?.idCollection
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
    idCollection: '',
};
