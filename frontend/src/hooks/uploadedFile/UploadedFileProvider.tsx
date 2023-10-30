import React, { useReducer } from 'react';
import { UploadedFileContext } from './UploadedFileContext';
import { initialState, reducer } from './reducer';

export const UploadedFileProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);


  return (
    <UploadedFileContext.Provider value={[state, dispatch]}>
      {children}
    </UploadedFileContext.Provider>
  );
};
