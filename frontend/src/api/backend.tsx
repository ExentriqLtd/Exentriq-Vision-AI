import { backendUrl, session } from "~/config";
import type { Message } from "~/types/conversation";
import type { BackendDocument } from "~/types/backend/document";
import type { BackendCollections } from "~/types/backend/collections";
import type { IntSummarization, SecDocument } from "~/types/document";
import { fromBackendDocumentToFrontend } from "./utils/documents";

interface CreateConversationPayload {
  id: string;
}

interface GetConversationPayload {
  result: {
    documents: BackendDocument[];
    messages: Message[];
  };
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
export interface CreateCollection {
  name: string;
  is_public: boolean;
}
export interface RenameCollection {
  name: string;
  is_public: boolean;
  id: string;
}

export interface AgentItem {
  content: string;
  created_at: string;
  name: string;
  uuid: string;
  status: string,
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

  public async getAgents(): Promise<AgentItem[]> {
    const endpoint = "api/agents";
    const res = await this.get(endpoint);
    const data = await res.json();
    return data;
  }

  public async executeAgent(collectionId: string | undefined, prompt: string): Promise<string> {
    const endpoint = "api/agent/";
    const payload = { session, collection_id: collectionId, agent: prompt };
    const res = await this.post(endpoint, payload);
    const data = (await res.json());
    return data;
  }

  public async checkAgentStatus(agentId:string, collectionId: string): Promise<any> {
    const endpoint = `api/agents/${agentId}/${collectionId}`;
    const res = await this.get(endpoint);
    const data = await res.json();
    console.log('checkAgentStatus--->', data);
    return data;
  }

  
  // public async editPrompts(promptsId: string | undefined, content: string): Promise<string> {
  //   const endpoint = "/api/prompts/";
  //   const payload = { session, promptsId, content};
  //   const res = await this.put(endpoint, payload);
  //   const data = (await res.json());

  //   return data;
  // }
  // public async insertPrompts(content: string): Promise<string> {
  //   const endpoint = "/api/prompts/";
  //   const payload = { session, content};
  //   const res = await this.post(endpoint, payload);
  //   const data = (await res.json());

  //   return data;
  // }
  
  // public async deletePrompts(promptsId: string | undefined): Promise<string> {
  //   const endpoint = "/api/prompts/";
  //   const payload = { session, promptsId};
  //   const res = await this.delete(endpoint, payload);
  //   const data = (await res.json());

  //   return data;
  // }
  public async createConversation(collectionId: string | undefined): Promise<string> {
    const endpoint = "api/conversation/";
    const payload = { session, collectionId };
    const res = await this.post(endpoint, payload);
    const data = (await res.json()) as CreateConversationPayload;

    return data.id;
  }

  public async fetchConversation(id: string): Promise<GetConversationReturnType> {
    const endpoint = `api/conversation/${id}?&spaceId=${session.spaceId || '-1'}&username=${session.username || 'unknown'}&sessionToken=${session.sessionToken || 'empty'}&engine=${session.engine || ''}`;
    const res = await this.get(endpoint);
    const data = (await res.json()) as GetConversationPayload;
    return {
      messages: data?.result?.messages,
      documents: fromBackendDocumentToFrontend(data?.result?.documents),
    };
  }

  public async fetchSummarization(id: string, reprocess: boolean): Promise<IntSummarization> {
    const endpoint = `api/summarization2/${id}?reprocess=${reprocess}`;
    const res = await this.get(endpoint);

    const data = await res.json() as IntSummarization;

    console.log('DATA', data);

    return data;
  }

  public async fetchDocuments(): Promise<SecDocument[]> {
    const endpoint = `api/document/`;
    const res = await this.get(endpoint);
    const data = (await res.json()) as BackendDocument[];
    const docs = fromBackendDocumentToFrontend(data);
    return docs;
  }

  public async getDetailFile(uuid: string): Promise<NonNullable<unknown>> {
    const endpoint = `api/file/${uuid}`;
    const res = await this.get(endpoint);

    const data = await res.json() as object;
    return data
  }

  public async fetchCollections(value: string): Promise<GetCollectionsReturnType[]> {
    const endpoint = `api/collections/list`;
    const payload = { session, query: value };
    const res = await this.post(endpoint, payload);
    const data = (await res.json()) as BackendCollections[];
    return data;
  }


  public async uploadFile(file: Blob, collectionId: string): Promise<object> {
    const endpoint = `api/collections/upload_dev`;
    console.log('collectionId', collectionId);
    const payload = {
      collectionId,
      session
    }
    const fileName: string | undefined = file?.name
    const data = new FormData();
    data.append('file', file, fileName);

    data.append('data', JSON.stringify(payload));
    const url = backendUrl + endpoint;
    const res = await fetch(url, {
      method: "POST",
      body: data,
    });

    const dataResult = await res.json() as object;
    return dataResult;
  }

  public async uploadFileFromDrive(collectionId: string): Promise<object> {
    const endpoint = `api/collections/uploadFromDrive`;
    console.log('collectionId', collectionId);
    const payload = {
      collectionId,
      session
    }
    const res = await this.post(endpoint, payload);

    const data = await res.json() as object;
    return data;
  }

  public async createCollection({ name, is_public }: CreateCollection): Promise<string> {
    const endpoint = "api/collections/create_dev";
    const payload = { session, name, is_public };
    const res = await this.post(endpoint, payload);

    const data = await res.json() as string;
    return data;
  }

  public async deleteCollection(id: string): Promise<string> {
    const endpoint = "api/collections/delete_dev";
    const payload = { session, collectionId: id };
    const res = await this.post(endpoint, payload);

    const data = await res.json() as string;
    return data;
  }

  public async renameCollection({ id, name, is_public }: RenameCollection): Promise<string> {
    const endpoint = "api/collections/rename";
    const payload = { session, collectionId: id, name, is_public };
    const res = await this.post(endpoint, payload);

    const data = await res.json() as string;
    return data;
  }

  public async getCollectionDetails(collectionId?: string): Promise<string> {
    const endpoint = "api/collections/details";
    const payload = { session, collectionId };
    const res = await this.post(endpoint, payload);

    const data = await res.json() as string;
    return data;
  }
}

export const backendClient = new BackendClient();
