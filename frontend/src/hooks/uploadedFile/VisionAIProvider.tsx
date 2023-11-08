import React, { useReducer } from 'react';
import { VisionAIContext } from './VisionAIContext';
import { action, initialState, reducer, stateReducer } from './reducer';

interface ProviderProps {
  (prevState: stateReducer, action: action): any
}
export const VisionAIProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer<ProviderProps>(reducer, initialState);


  return (
    //@ts-ignore
    <VisionAIContext.Provider value={[state, dispatch]}>
      {children}
    </VisionAIContext.Provider>
  );
};
