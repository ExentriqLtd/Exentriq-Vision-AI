import React, { useReducer } from 'react';
import { VisionAIContext } from './VisionAIContext';
import { initialState, reducer } from './reducer';

interface ProviderProps {
  (prevState: any, action: any): any
}
export const VisionAIProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer<ProviderProps>(reducer, initialState);


  return (
    <VisionAIContext.Provider value={[state, dispatch]}>
      {children}
    </VisionAIContext.Provider>
  );
};
