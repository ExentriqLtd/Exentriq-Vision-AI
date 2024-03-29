import type { DocumentColorEnum } from "~/utils/colors";

export enum DocumentType {
  TenK = "Form 10K",
  TenQ = "Form 10Q",
}

export type Ticker = {
  ticker: string;
  fullName: string;
};

export interface SecDocument extends Ticker {
  id: string;
  year: string;
  docType: DocumentType;
  quarter?: string;
  color: DocumentColorEnum;
  collection_id: string;
  created_at: string;
  file_id: string;
  filename: string;
  uuid: string;
  space_id: string;
  status: string;
  url: string;
  username: string;
}

export interface IntSummarization {
  status: string;
  summarization: {
    values: string
  };
}
