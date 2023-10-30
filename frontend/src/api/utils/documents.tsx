import type { BackendDocument } from "~/types/backend/document";
// import { BackendDocumentType } from "~/types/backend/document";
import type { SecDocument } from "~/types/document";
// import {DocumentType } from "~/types/document";
// import { documentColors } from "~/utils/colors";

export const fromBackendDocumentToFrontend = (
  backendDocuments: BackendDocument[]
) => {
  const frontendDocs: SecDocument[] = [];
  backendDocuments.map((backendDoc, index) => {
    console.log('backendDocuments index', index);
    
    // const backendDocType = backendDoc.metadata_map.sec_document.doc_type;
    // const frontendDocType =
    //   backendDocType === BackendDocumentType.TenK
    //     ? DocumentType.TenK
    //     : DocumentType.TenQ;

    // we have 10 colors for 10 documents
    const filename = backendDoc?.filename?.replace('.pdf', '').replace('.PDF', '')
    // const colorIndex = index < 10 ? index : 0;
    const payload = {
      uuid: backendDoc.uuid,
      file_id: backendDoc.file_id,
      url: backendDoc.url,
      filename: filename,
      // ticker: backendDoc.metadata_map.sec_document.company_ticker,
      // fullName: backendDoc.metadata_map.sec_document.company_name,
      // year: String(backendDoc.metadata_map.sec_document.year),
      // docType: frontendDocType,
      // color: documentColors[colorIndex],
      // quarter: backendDoc.metadata_map.sec_document.quarter || "",
    } as SecDocument;
    frontendDocs.push(payload);
  });
  return frontendDocs;
};
