import React, { useReducer } from 'react';
import { VisionAIContext } from './VisionAIContext';
import { initialState, reducer } from './reducer';
import type { action, stateReducer } from './reducer';

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
