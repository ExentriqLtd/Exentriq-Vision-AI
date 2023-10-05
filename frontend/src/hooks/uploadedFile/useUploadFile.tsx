import {useContext} from 'react';
import { UploadedFileContext } from './index';
//this is provider context
export const useUploadedFile = () => {
  return useContext(UploadedFileContext);
};
