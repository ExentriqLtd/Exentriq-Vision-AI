import { backendUrl, session } from "~/config";
import type { Message } from "~/types/conversation";
import type { BackendDocument } from "~/types/backend/document";
import type { BackendCollections } from "~/types/backend/collections";
import type { SecDocument } from "~/types/document";
import { fromBackendDocumentToFrontend } from "./utils/documents";

interface CreateConversationPayload {
  id: string;
}

interface GetConversationPayload {
  id: string;
  messages: Message[];
  documents: BackendDocument[];
}

interface GetConversationReturnType {
  messages: Message[];
  documents: SecDocument[];
}

interface GetCollectionsReturnType {
  status: string;
  result: {
    uuid: string;
    created_at: string;
    name: string;
    spaceId: string;
    username: string;
  };
}

class BackendClient {
  private async get(endpoint: string) {
    const url = backendUrl + endpoint;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res;
  }

  private async post(endpoint: string, body?: object) {
    const url = backendUrl + endpoint;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res;
  }

  public async createConversation(collectionId: string | undefined): Promise<string> {
    const endpoint = "api/conversation/";
    const payload = { session, collectionId };
    const res = await this.post(endpoint, payload);
    const data = (await res.json()) as CreateConversationPayload;

    return data.id;
  }

  public async fetchConversation(
    id: string
  ): Promise<GetConversationReturnType> {
    const endpoint = `api/conversation/${id}?&spaceId=${session.spaceId}&username=${session.username}&sessionToken=${session.sessionToken}`;
    const res = await this.get(endpoint);
    const data = (await res.json()) as GetConversationPayload;
    return {
      messages: data?.result?.messages,
      documents: fromBackendDocumentToFrontend(data?.result?.documents),
    };
  }

  public async fetchDocuments(): Promise<SecDocument[]> {
    const endpoint = `api/document/`;
    const res = await this.get(endpoint);
    const data = (await res.json()) as BackendDocument[];
    const docs = fromBackendDocumentToFrontend(data);
    return docs;
  }

  public async fetchCollections(): Promise<GetCollectionsReturnType[]> {
    const endpoint = `api/collections/list`;
    const payload = { session };
    const res = await this.post(endpoint, payload);
    const data = (await res.json()) as BackendCollections[];
    return data;
  }

  
  public async uploadFile(files: File[], collectionId: string): Promise<object> {
    const endpoint = `api/collections/upload`;
    console.log('collectionId', collectionId);
    const payload = {
      collectionId,
      session
    }
    const file: File | undefined = files[0]
    const fileName: string| undefined = file?.name

    const data = new FormData();
    data.append('file', file as Blob, fileName);

    data.append('data', JSON.stringify(payload));
    const url = backendUrl + endpoint;
    const res = await fetch(url, {
      method: "POST",
      body: data,
    });


    const dataResult = (await res.json());
    console.log('DATA', dataResult);
    return dataResult;
  }

  public async createCollection(name: string): Promise<string> {
    const endpoint = "api/collections/create";
    const payload = { session, name };
    const res = await this.post(endpoint, payload);
    
    const data = (await res.json());
    console.log('DATA', data);
    return data;
  }

  public async getCollectionDetails(collectionId?: string): Promise<string> {
    const endpoint = "api/collections/details";
    const payload = { session, collectionId };
    const res = await this.post(endpoint, payload);
    
    const data = (await res.json());
    console.log('DATA', data);
    return data;
  }
}

export const backendClient = new BackendClient();
