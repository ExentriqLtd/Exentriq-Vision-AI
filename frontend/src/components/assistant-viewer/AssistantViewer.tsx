import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";


interface AssistantViewerProps {
}

export const AssistantViewer: React.FC<AssistantViewerProps> = ({

}) => {
  //@ts-ignore
  const [stateVisionAI, dispatchVisionAI] = useVisionAI()

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
        </div>
      </div >
    </>
  );
};

export default AssistantViewer;
