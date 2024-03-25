import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";


interface AssistantViewerProps {
}

export const AssistantViewer: React.FC<AssistantViewerProps> = ({

}) => {
  //@ts-ignore
  const [stateVisionAI, dispatchVisionAI] = useVisionAI()

  const form = {
    action: "url",
    rows: [
        {
            id: "row1",
            cols: [
              {
                  input: "text",
                  label: "Campo1",
              },
              {
                input: "number",
                label: "Campo2",
              },
              {
                input: "calendar",
                label: "Campo3",
              },
            ]
        },
        {
            id: "row2",
            cols: [
              {
                  input: "text",
                  label: "Campo4",
              }
            ]
        }
    ]
}

  return (
    <>
      <div className="flex flex-col h-full items-start w-full">
        <div className="flex h-[80px] w-full items-center justify-between">
          <div className="flex w-full items-center justify-end">
            <button
              onClick={() => {
                dispatchVisionAI({ type: 'SET_ASSISTANT_VIEWER', payload: { isAssistantChatOpen: false } })
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
        </div>
        <div className="flex border h-[100vh] max-h-[calc(100vh-150px)] flex-grow flex-col overflow-scroll w-full p-4">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          {form && (
                  <form>
                    {form.rows.map(row => (
                      <div key={row.id} className={`mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-${row.cols.length}`}>
                        {row.cols.map(col => (
                          <div key={col.input} className={`sm:col-span-${Math.floor(6 / row.cols.length)}`}>
                            <label htmlFor={col.input} className="block text-sm font-medium leading-6 text-gray-900">
                              {col.label}
                            </label>
                            <div className="mt-2">
                              <input
                                type={col.input}
                                name={col.label}
                                id={col.label}
                                autoComplete={col.input}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Save
                    </button>
                  </form>
                )}
        </div>
      </div >
    </>
  );
};

export default AssistantViewer;
