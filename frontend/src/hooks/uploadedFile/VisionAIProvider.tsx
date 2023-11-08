import React, { useReducer } from 'react';
import { VisionAIContext } from './VisionAIContext';
import { initialState, reducer } from './reducer';

export const VisionAIProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);


  return (
    <VisionAIContext.Provider value={[state, dispatch]}>
      {children}
    </VisionAIContext.Provider>
  );
};
