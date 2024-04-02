import React, { useEffect, useState } from "react";
import { backendClient } from "~/api/backend";
import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";

interface AssistantViewerProps {}

interface DynamicForm {
  action: string;
  rows: {
    id: string;
    cols: {
      input: string;
      label: string;
      value: boolean | string;
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
      setDynamicForm(assistantResults.data);
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
        console.log('RES', res);
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
                            className="rounded color-primary-ex"
                            checked={col.value as boolean}
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
                            className="relative font-nunito text-gray-90 text-[18px]"
                          >
                            {col.label}
                          </label>
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
                            className="block w-full rounded-md border-gray-300 shadow-sm"
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
