import { backendUrl, session } from "~/config";
import type { Message } from "~/types/conversation";
import type { BackendDocument } from "~/types/backend/document";
import type { IntSummarization, SecDocument } from "~/types/document";
import { fromBackendDocumentToFrontend } from "./utils/documents";
import toast from "react-hot-toast";
import { HiCheckCircle, HiXCircle, HiX } from 'react-icons/hi';

interface CreateConversationPayload {
  id: string;
  agents: [];
  documents: BackendDocument[];
  updated_at: string;
}

interface GetConversationPayload {
  result: {
    documents: BackendDocument[];
    messages: Message[];
    agents: [];
  };
  id: string;
  messages: Message[];
  documents: BackendDocument[];
}

interface GetConversationReturnType {
  messages: Message[];
  documents: SecDocument[];
  agents: [];
}

interface GetCollectionsReturnType {
  status: string;
  result: {
    uuid: string;
    created_at: string;
    name: string;
    spaceId: string;
    username: string;
    doc_number: number | null;
    doc_processing: number | null;
    is_public: boolean;
    search_name: string;
    asst_id: string | null;
    thread_id: string | null;
  }[];
}

interface getStatusResult {
  status: string;
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
  description: string;
}
class BackendClient {
  private async get(endpoint: string) {
    const url = backendUrl(session.spaceId) + endpoint;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Authorization": "Basic bWV0aXM6UEBzc3cwcmQ5OTk=" }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res;
  }

  private async post(endpoint: string, body?: object) {
    const url = backendUrl(session.spaceId) + endpoint;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic bWV0aXM6UEBzc3cwcmQ5OTk="
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res;
  }

  public async getAgents(): Promise<AgentItem[]> {
    const endpoint = `api/agents?&spaceId=${session.spaceId || '-1'}&username=${session.username || 'unknown'}&sessionToken=${session.sessionToken || 'empty'}&engine=${session.engine || ''}`;
    const res = await this.get(endpoint);
    const data = await res.json();
    return data;
  }

  public async executeAgent(collectionId: string | undefined, prompt: string, reprocess: boolean): Promise<string> {
    const endpoint = "api/agent/";
    const payload = { session, collection_id: collectionId, agent: prompt, reprocess: reprocess };
    const res = await this.post(endpoint, payload);
    const data = (await res.json());
    return data;
  }

  public async checkAgentStatus(agentId: string, collectionId: string): Promise<any> {
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
  public async createConversation(collectionId: string | undefined): Promise<CreateConversationPayload> {
    const endpoint = "api/conversation/";
    const payload = { session, collectionId };
    const res = await this.post(endpoint, payload);
    const data = (await res.json()) as CreateConversationPayload;

    return data;
  }

  public async fetchConversation(id: string): Promise<GetConversationReturnType> {
    const endpoint = `api/conversation/${id}?&spaceId=${session.spaceId || '-1'}&username=${session.username || 'unknown'}&sessionToken=${session.sessionToken || 'empty'}&engine=${session.engine || ''}`;
    const res = await this.get(endpoint);
    const data = (await res.json()) as GetConversationPayload;
    return {
      messages: data?.result?.messages,
      documents: fromBackendDocumentToFrontend(data?.result?.documents),
      agents: data?.result?.agents,
    };
  }

  public async fetchSummarization(
    id: string,
    reprocess: boolean,
    summarization_status: string,
    router: any,
    collectionID: string,
  ): Promise<IntSummarization> {
    const endpoint = `api/summarization2/${id}?reprocess=${reprocess}&spaceId=${session.spaceId || '-1'}&username=${session.username || 'unknown'}&sessionToken=${session.sessionToken || 'empty'}&engine=${session.engine || ''}`;
    const res = await this.get(endpoint);
    const data = await res.json() as IntSummarization;

    if (data.status === "ERROR" && (summarization_status !== 'READY' && summarization_status !== 'ERROR')) {
      toast.custom((t) => (
        <button onClick={() => {
          router.push({
            pathname: `/collection/${collectionID}`,
            query: session,
          })
            .catch(() => console.log("error navigating to conversation"))

          toast.dismiss(t.id)
        }}>
          <div className="flex items-center gap-3 p-4 bg-red-100 border border-red-400 rounded-lg shadow-md">
            <HiXCircle className="text-red-600 w-6 h-6" />
            <span className="text-red-800 font-medium">The document summary <b>failed</b></span>
          </div>
        </button>

      ), { duration: 10000 });
    } else if (data.status === "READY" && (summarization_status !== 'READY' && summarization_status !== 'ERROR')) {
      toast.custom((t) => (
        <button onClick={() => {
          router.push({
            pathname: `/collection/${collectionID}`,
            query: session,
          })
            .catch(() => console.log("error navigating to conversation"))

          toast.dismiss(t.id)
        }}>
          <div className="flex items-center gap-3 p-4 bg-green-100 border border-green-400 rounded-lg shadow-md">
            <HiCheckCircle className="text-green-600 w-6 h-6" />
            <span className="text-green-800 font-medium">The document summary has been completed <b>successfully</b></span>
          </div>
        </button>
      ), { duration: 10000 });
    }

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
    const endpoint = `api/file/${uuid}?&spaceId=${session.spaceId || '-1'}&username=${session.username || 'unknown'}&sessionToken=${session.sessionToken || 'empty'}&engine=${session.engine || ''}`;
    const res = await this.get(endpoint);

    const data = await res.json() as object;
    return data
  }

  public async fetchCollections(value: string): Promise<GetCollectionsReturnType[]> {
    const endpoint = `api/collections/list`;
    const payload = { session, query: value };
    const res = await this.post(endpoint, payload);
    const data = (await res.json()) as GetCollectionsReturnType[];
    return data;
  }

  public async uploadFile(file: Blob, collectionId: string): Promise<object> {
    const endpoint = `api/collections/upload_dev_2`;
    console.log('collectionId', collectionId);
    const payload = {
      collectionId,
      session,
    }
    const fileName: string | undefined = file?.name
    const data = new FormData();
    data.append('file', file, fileName);

    data.append('data', JSON.stringify(payload));
    const url = backendUrl(session.spaceId) + endpoint;
    const res = await fetch(url, {
	  headers: { 
      	"Authorization": "Basic bWV0aXM6UEBzc3cwcmQ5OTk=" 
      },  
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

  public async sendAgentForm(action: string | undefined, formData: any): Promise<getStatusResult> {
    console.log(formData);
    const endpoint = `api${action}`;
    const payload = { session, data: formData };
    const res = await this.post(endpoint, payload);
    const data = (await res.json());
    return data;
  }
}

export const backendClient = new BackendClient();
