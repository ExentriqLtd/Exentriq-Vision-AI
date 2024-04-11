import React, { useRef, useEffect, useState } from "react";
import Modal from "../basics/Modal";
import { backendClient, AgentItem } from "~/api/backend";
import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";
import { BiLoaderAlt } from "react-icons/bi";

interface AssistantsModalProps {
  isOpen: boolean;
  conversationId: string;
  toggleModal: () => void;
}

const AssistantsModal: React.FC<AssistantsModalProps> = ({
  isOpen,
  toggleModal,
  conversationId,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dataAgents, setDataAgents] = useState<AgentItem[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false); 
  const [pollingAgents, setPollingAgents] = useState<NodeJS.Timeout[]>([]); 
  const [stateVisionAI, dispatchVisionAI] = useVisionAI();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.select();
      getAgents();
    }
  }, [isOpen]);

  useEffect(() => {
    // Cleanup function per interrompere il polling quando il modal viene chiuso
    return () => {
      pollingAgents.forEach(intervalId => clearInterval(intervalId));
    };
  }, [isOpen]);

  useEffect(() => {
    dataAgents.forEach((agent: AgentItem) => {
      if (agent.status === 'START') {
        console.log('If status start UseEffect');
        checkAgentStatus(agent.uuid);
      }
    });
  }, [dataAgents]);

  const getAgents = () => {
    setLoadingAgents(true); 
  
    backendClient
      .getAgents()
      .then((res) => {
        setDataAgents(res.map(agent => ({ ...agent, status: 'START' })));
        setLoadingAgents(false); 
      })
      .catch((e) => {
        console.log('error:::getAgents', e);
        setLoadingAgents(false); 
      });
  };

  const checkAgentStatus = (agentId: string) => {
    console.log('checkAgentStatus', agentId, dataAgents);
    const intervalId = setInterval(async () => {
      try {
        const agentStatusRes = await backendClient.checkAgentStatus(agentId, conversationId);
        console.log('agentStatusRes', agentStatusRes);

        if(agentStatusRes !== 'IN PROGRESS') {
            setDataAgents((prevAgents) =>
            prevAgents.map((prevAgent) =>
              prevAgent.uuid === agentId ? { ...prevAgent, status: agentStatusRes.status } : prevAgent
            )
          );
        }

        if (agentStatusRes.status === 'SUCCESS' || agentStatusRes.status === 'ERROR' || agentStatusRes.status === null) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.log('Error polling agent status:', error);
        clearInterval(intervalId);
      }
    }, 1000);

    setPollingAgents((prevPollingAgents) => [...prevPollingAgents, intervalId]);
  };
  

  const executeAgent = async (agentName: string, agentId: string, reprocess: boolean, openResult: boolean) => {
    try {
      backendClient.executeAgent(conversationId, agentName, reprocess).then((res) => {
        console.log('execute,res', res);
        if(openResult) {
          dispatchVisionAI({ type: 'SET_ASSISTANT_VIEWER', payload: { isAssistantChatOpen: true, assistantResults: res } });
        }
      });
      /* Imposto lo stato in IN PROGRESS per quell'agente, ma in teoria dovrebbe farlo l'execute agent qui sopra o il check andrà sempre in null (come succede ora che sta in errore) */
      setDataAgents(prevAgents =>
        prevAgents.map(prevAgent =>
          prevAgent.uuid === agentId ? { ...prevAgent, status: 'IN PROGRESS' } : prevAgent
        )
      );
      checkAgentStatus(agentId);
    } catch (error) {
      console.log('error:::executeAgent', error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} title="Agents" maxWidth="90vw">
      <div className="overflow-y-auto max-h-[calc(90vh-1rem)]">
        {loadingAgents ? (
          <div>Loading agents...</div>
        ) : (
          dataAgents.map((item: AgentItem) => (
            <div key={item.uuid} className="flex flex-row items-center justify-between border-b border-slate-100 py-2 gap-3 w-[50vw]">
              <div className="flex flex-col">
                <div className="font-semibold">{item.name}</div>
                <div className="text-slate-500 mt-2 text-[14px]">{item.description}</div>
              </div>
              {item.status !== 'START' && (
                <>
                  {item.status === null ? (
                    <button
                      onClick={() => {
                        executeAgent(item.name, item.uuid, false, false);
                      }}
                      className="block rounded-sm bg-primary-ex px-3.5 py-2.5 ml-2.5 text-center text-sm text-white shadow-md hover:bg-primary-ex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Execute
                    </button>
                  ) : item.status === 'SUCCESS' ? (
                    <button
                      onClick={() => {
                        toggleModal();
                        executeAgent(item.name, item.uuid, false, true);
                      }}
                      className="block rounded-sm bg-primary-ex px-3.5 py-2.5 ml-2.5 text-center text-sm text-white shadow-md hover:bg-primary-ex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Open
                    </button>
                  ) : item.status === 'IN PROGRESS' ? (
                    <BiLoaderAlt className="animate-spin" color="#1bbc9b" size={22} />
                  ) : item.status === 'ERROR' ? (
                    <button
                      onClick={() => {
                        executeAgent(item.name, item.uuid, true, false);
                      }}
                      className="block rounded-sm bg-primary-ex px-3.5 py-2.5 ml-2.5 text-center text-sm text-white shadow-md hover:bg-primary-ex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Reprocess
                    </button>
                  ) : (
                    <div className="none"></div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default AssistantsModal;
