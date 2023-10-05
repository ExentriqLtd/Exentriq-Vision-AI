import React from 'react';
import { initialState } from './reducer';

export const UploadedFileContext = React.createContext({
    stateUploadedFile: initialState,
    dispatchUploadedFile: (props: any) => null
})

