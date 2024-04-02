import { useEffect, useState } from "react";
import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";


interface AssistantViewerProps {
}

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


export const AssistantViewer: React.FC<AssistantViewerProps> = ({

}) => {
  //@ts-ignore
  const [stateVisionAI, dispatchVisionAI] = useVisionAI()
  const { assistantResults, isAssistantChatOpen } = stateVisionAI;
  const [dynamicForm, setDynamicForm] = useState<DynamicForm>({
    action: "",
    rows: [],
  });
  
  useEffect(() => {
    if (isAssistantChatOpen && assistantResults) {
      console.log('Guarda qui', assistantResults)
      setDynamicForm(assistantResults.data);
    }
  }, [isAssistantChatOpen])
  
  return (
      <div className="flex flex-col h-full items-start w-full">
        <div className="flex h-[80px] w-full items-center justify-end">
          <button
            onClick={() => {
              dispatchVisionAI({ type: 'SET_ASSISTANT_VIEWER', payload: { isAssistantChatOpen: false, assistantResults: {} } })
            }}
            className="
              block 
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
              focus-visible:outline-indigo-600">
            Close
          </button>
        </div>
        <div className="flex border h-[100vh] max-h-[calc(100vh-150px)] flex-grow flex-col overflow-scroll w-full p-4">
          {dynamicForm && (
            <form action={dynamicForm.action}>
              {dynamicForm.rows.map((row, indexRow) => (
                <div key={row.id} className={`flex flex-row ${indexRow !== 0 ? 'mt-5' : ''}`}>
                  {row.cols.map((col, index) => (
                    <div key={index} className={`col-span-${index+1} p-2`}>
                      {col.input == 'checkbox' ? (
                        <>
                          <div className="inputCheckBoxContainer flex flex-row gap-3 items-center">
                            <input
                                type={'checkbox'}
                                name={col.label}
                                id={col.label}
                                autoComplete={col.input}
                                className="rounded color-primary-ex"                            
                                defaultChecked={col.value}
                            />
                            <label htmlFor={col.input} className="relative font-nunito text-gray-90 text-[18px]">
                              {col.label}
                            </label>
                          </div>
                        </>
                      ) : (
                        <>
                          <label htmlFor={col.input} className="relative font-nunito text-gray-90 text-[18px]">
                            {col.label}
                          </label>
                          <div className="mt-2">
                            <input
                              type={col.input}
                              name={col.label}
                              id={col.label}
                              autoComplete={'none'}
                              className="block w-full rounded-md border-gray-300 shadow-sm"
                              defaultValue={col.value}
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
      </div >
  );
};

export default AssistantViewer;
