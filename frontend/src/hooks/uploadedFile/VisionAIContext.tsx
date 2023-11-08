import React from 'react';
import { initialState } from './reducer';

export const VisionAIContext = React.createContext({
    stateVisionAI: initialState,
    dispatchVisionAI: () => null
})

