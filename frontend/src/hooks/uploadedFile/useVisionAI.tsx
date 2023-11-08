import {useContext} from 'react';
import { VisionAIContext } from './index';
//this is provider context
export const useVisionAI = () => {
  return useContext(VisionAIContext);
};
