import React, { useEffect, useState } from "react";
import { backendClient } from "~/api/backend";
import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";
import toast from 'react-hot-toast';

interface AssistantViewerProps {}

interface DynamicForm {
  action: string;
  rows: {
    id: string;
    cols: {
      input: string;
      label: string;
      value: boolean | string;
      motivation: string;
    }[];
  }[];
}

export const AssistantViewer: React.FC<AssistantViewerProps> = ({}) => {
  //@ts-ignore
  const [stateVisionAI, dispatchVisionAI] = useVisionAI();
  const { assistantResults, isAssistantChatOpen } = stateVisionAI;
  const [dynamicForm, setDynamicForm] = useState<DynamicForm | null>(null);

  useEffect(() => {
    if (isAssistantChatOpen && assistantResults) {
      var staticData = {
        "action": "/agents/action/004bf276-e2dc-11ee-8b3d-0233451af6ee/bd824bc4-f73b-11ee-b8b0-0233451af6ee",
        "rows": [
            {
                "id": "row-0",
                "cols": [
                    {
                        "input": "checkbox",
                        "label": "I nomi degli allegati sono uguali agli allegati stessi, alla gerarchia delle norme ed alla lista degli allegati indicati nel documento contratto?",
                        "value": false,
                        "motivation": "Gli allegati elencati nel documento contratto includono specifici documenti come l'Offerta e l'Informativa privacy, mentre i file caricati come RdA e PO non corrispondono ai nomi o ai contenuti specificati nel contratto."
                    }
                ]
            },
            {
                "id": "row-1",
                "cols": [
                    {
                        "input": "checkbox",
                        "label": "La durata indicata nel documento contratto è coerente con la data indicata nel documento RdA?",
                        "value": false,
                        "motivation": "Non è stato possibile identificare una durata specifica nel documento contratto o confrontarla con una data specifica nel documento RdA per effettuare un adeguato confronto."
                    }
                ]
            },
            {
                "id": "row-2",
                "cols": [
                    {
                        "input": "checkbox",
                        "label": "L’importo indicato nel documento contratto è nei limiti di spesa autorizzati dal documento RdA?",
                        "value": false,
                        "motivation": "Non è stato possibile identificare un importo specifico nel documento contratto da confrontare con il limite di spesa autorizzato indicato nel documento RdA."
                    }
                ]
            },
            {
                "id": "row-3",
                "cols": [
                    {
                        "input": "checkbox",
                        "label": "L’importo indicato nel documento contratto è uguale alle cifre in numero?",
                        "value": false,
                        "motivation": "Non è stato possibile identificare un importo specifico in cifre nel documento contratto che possa essere direttamente verificato o controllato per corrispondenza."
                    }
                ]
            },
            {
                "id": "row-4",
                "cols": [
                    {
                        "input": "checkbox",
                        "label": "Se sono previste tranche di pagamenti: la somma delle stesse corrisponde all’importo totale indicato su contratto?",
                        "value": "ND",
                        "motivation": "Non è stato possibile identificare specifiche tranche di pagamenti nel documento contratto che potrebbero essere sommate per verificare se corrispondono all'importo totale specificato."
                    }
                ]
            },
            {
                "id": "row-5",
                "cols": [
                    {
                        "input": "checkbox",
                        "label": "nel file contratto I numeri dei paragrafi degli articoli sono consecutivi?",
                        "value": false,
                        "motivation": "Non è stato possibile confermare che i numeri dei paragrafi degli articoli nel documento contratto siano consecutivi senza un esame più approfondito del documento."
                    }
                ]
            },
            {
                "id": "row-6",
                "cols": [
                    {
                        "input": "checkbox",
                        "label": "nel file contratto I rimandi agli articoli/paragrafi contrattuali indicati negli articoli stessi sono giusti?",
                        "value": true,
                        "motivation": "I rimandi agli articoli e ai paragrafi all'interno del documento contratto sono stati verificati e risultano corretti."
                    }
                ]
            },
            {
                "id": "row-7",
                "cols": [
                    {
                        "input": "checkbox",
                        "label": "nel file contratto In caso di fideiussione è inserito lo specifico articolo?",
                        "value": "ND",
                        "motivation": "Non è stato possibile trovare riferimenti specifici a un articolo di fideiussione all'interno del documento contratto."
                    }
                ]
            },
            {
                "id": "row-8",
                "cols": [
                    {
                        "input": "checkbox",
                        "label": "nel file contratto sono presenti gli articoli relativi al recesso, esclusiva, gerarchia delle norme e divieto di cessione?",
                        "value": true,
                        "motivation": "Il documento contratto contiene articoli che trattano specificamente il recesso, l'esclusiva, la gerarchia delle norme e il divieto di cessione."
                    }
                ]
            },
            {
                "id": "row-9",
                "cols": [
                    {
                        "input": "checkbox",
                        "label": "La modalità di pagamento in testata nel documento RdA è uguale a quella indicata nel documento contratto?",
                        "value": "ND",
                        "motivation": "Il documento RdA non fornisce dettagli specifici sulla modalità di pagamento che possano essere direttamente confrontati con quelle descritte nel documento contratto, dove le modalità di pagamento sono esplicitamente delineate."
                    }
                ]
            }
        ]
    }
      // setDynamicForm(assistantResults.data_res ? assistantResults.data_res : assistantResults.data);
      setDynamicForm(staticData);
    }
  }, [isAssistantChatOpen, assistantResults]);

  const handleInputChange = (
    rowIndex: number,
    colIndex: number,
    newValue: string | boolean
  ) => {
    if (dynamicForm) {
      const updatedForm = { ...dynamicForm };
      const row = updatedForm.rows[rowIndex];
      if (row) {
        const col = row.cols[colIndex];
        if (col) {
          col.value = newValue;
          setDynamicForm(updatedForm);
        }
      }
    }
    
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (dynamicForm) {
      
      // Invia una richiesta POST con i dati del form
      backendClient.sendAgentForm(dynamicForm.action, dynamicForm).then((res) => {
        if(res.status == 'SUCCESS') {
          toast.success('Modifica inviata con successo.', {
            position: 'top-right',
          })
        } else {
          /*TODO: se va in errore andrebbe messo un message di motivazione */
          toast.error(res.status)
        }
      })
      .catch((e) => {
        console.log('e', e)
      });
    }
  };

  return (
    <div className="flex flex-col h-full items-start w-full">
      <div className="flex h-[80px] w-full items-center justify-end p-2">
        <button
          onClick={() => {
            dispatchVisionAI({
              type: "SET_ASSISTANT_VIEWER",
              payload: { isAssistantChatOpen: false, assistantResults: {} },
            });
          }}
          className="block 
              rounded-sm 
              bg-primary-ex 
              px-3.5 
              py-2.5 
              text-center 
              text-sm 
              text-white 
              shadow-md 
              hover:bg-primary-ex 
              focus-visible:outline 
              focus-visible:outline-2 
              focus-visible:outline-offset-2 
              focus-visible:outline-indigo-600"
        >
          Close
        </button>
      </div>
      <div className="flex border h-full flex-grow flex-col overflow-scroll w-full p-4">
        {dynamicForm && (
          <form onSubmit={handleSubmit} action={dynamicForm.action}>
            {dynamicForm.rows.map((row, indexRow) => (
              <div key={row.id} className={`flex flex-row ${indexRow !== 0 ? 'mt-5' : ''}`}>
                {row.cols.map((col, index) => (
                  <div key={index} className={`col-span-${index + 1} p-2`}>
                    {col.input === "checkbox" ? (
                      <>
                       <div className="inputCheckBoxContainer flex flex-row gap-3 items-center">
                          <input
                            type={"checkbox"}
                            name={col.label}
                            id={col.label}
                            autoComplete={col.input}
                            className={`color-primary-ex form-checkbox focus:ring-offset-0 focus:outline-none focus:ring-0 border-2 w-[25px] h-[25px] ${
                              col.value === "ND" ? "border-red-500" : ""
                            }`}
                            checked={col.value === "ND" ? false : (col.value as boolean)}
                            onChange={(e) =>
                              handleInputChange(
                                indexRow,
                                index,
                                e.target.checked
                              )
                            }
                          />
                          <label
                            htmlFor={col.input}
                            className={`relative font-nunito text-gray-90 text-[18px] ${
                              col.value === "ND" ? "text-red-500" : ""
                            }`}
                          >
                            {col.label}
                            {col.value === "ND" && col.motivation && (
                              <span className="text-sm block text-red-500">{col.motivation}</span>
                            )}
                          </label>
                        </div>

                      </>
                      ) : col.input === "calendar" ? (
                        <>
                          <label
                            htmlFor={col.input}
                            className="relative font-nunito text-gray-90 text-[18px]"
                          >
                            {col.label}
                          </label>
                          <div className="mt-2">
                            <input
                              type={"date"}
                              name={col.label}
                              id={col.label}
                              autoComplete={col.input}
                              className="rounded form-input"
                              onChange={(e) =>
                                handleInputChange(
                                  indexRow,
                                  index,
                                  e.target.value // Accedi al valore dalla proprietà value dell'evento
                                  )
                              }
                            />
                          </div>
                          <div className="">TODO: value non può essere una stringa nel caso di una data, ma dovrebbe essere una data. Se serve una stringa descrittiva va aggiunto all'oggetto una chiave apposita. Al momento la value è: {col.value}</div>
                        </> 
                      ) : col.input === "members" ? (
                        <>
                          <div className="">
                            Come fare la struttura dei membri?
                          </div>
                        </> 
                      ) : (
                      <>
                        <label
                          htmlFor={col.input}
                          className="relative font-nunito text-gray-90 text-[18px]"
                        >
                          {col.label}
                        </label>
                        <div className="mt-2">
                          <input
                            type={col.input}
                            name={col.label}
                            id={col.label}
                            autoComplete={"none"}
                            className="block w-full rounded-md border-gray-300 shadow-sm form-input"
                            value={col.value as string}
                            onChange={(e) =>
                              handleInputChange(indexRow, index, e.target.value)
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
            <button
              type="submit"
              className="block 
                rounded-sm 
                bg-primary-ex 
                px-3.5 
                py-2.5 
                mr-2.5
                text-center 
                text-sm 
                text-white 
                shadow-md 
                mt-10
                hover:bg-primary-ex 
                focus-visible:outline 
                focus-visible:outline-2 
                focus-visible:outline-offset-2 
                focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssistantViewer;
