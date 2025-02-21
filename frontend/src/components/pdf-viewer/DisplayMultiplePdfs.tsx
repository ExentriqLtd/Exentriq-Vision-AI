import { ViewPdf } from "~/components/pdf-viewer/ViewPdf";
import { useMultiplePdfs } from "../../hooks/useMultiplePdfs";
import type { SecDocument } from "~/types/document";
import cx from "classnames";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";
import { useRouter } from "next/router";
import { session } from "~/config";

// TODO: Sistemare la visualizzazione dei documenti per come sono mappati adesso.

interface DisplayMultiplePdfsProps {
  pdfs: SecDocument[];
  backToDetail?: boolean;
  collectionId: string;
}

export const DisplayMultiplePdfs: React.FC<DisplayMultiplePdfsProps> = ({
  pdfs,
  backToDetail,
  collectionId,
}) => {
  const { isActivePdf, handlePdfFocus } = useMultiplePdfs(pdfs);
  //@ts-ignore
  const [stateVisionAI, dispatchVisionAI] = useVisionAI()
  const router = useRouter()

  return (
    <>
      <div className="flex h-full items-start w-full">
        {pdfs.map((file) => {
          return (
            <div
              key={`viewing-${file.url}`}
              className={cx('w-full', { hidden: !isActivePdf(file) })}
            >
              <ViewPdf file={file} />
            </div>
          );
        })}

        <div className="flex h-full w-[80px] flex-col">
          <div className="flex h-[43px] w-[80px] items-center justify-center border-b border-l font-bold text-gray-90 ">
            <i onClick={() => {
              if (backToDetail) {
                router
                  .push({
                    pathname: `/collection/${collectionId}`,
                    query: session,
                  }).catch(() => console.log("error navigating to collection"))
              }
              dispatchVisionAI({ type: 'SET_PDF_VIEWER', payload: { isPdfViewerOpen: false } });
              dispatchVisionAI({ type: 'SET_ASSISTANT_VIEWER', payload: { isAssistantChatOpen: false, assistantResults: {} } });
            }}>
              <AiOutlineCloseCircle size={22} />
            </i>
          </div>
          {pdfs.map((file, index) => (
            <div style={{ paddingBottom: 4 }} className={`border ${isActivePdf(file)
              ? "border-l-0 bg-gray-pdf"
              : "bg-white font-light text-gray-60 "
              }`} key={index}>
              <button
                onClick={() => handlePdfFocus(file)}
                className={`group overflow-hidden flex h-[85px] justify-center px-2 py-1 font-nunito text-xs font-bold ${isActivePdf(file)
                  ? "border-l-0 bg-white-pdf"
                  : "bg-white font-light text-gray-60 "
                  }`}
              >
                {/* <div //TODO: aggiungere questa div quando abbiamo i dati
                  className={`flex flex-col items-start justify-start ${
                    borderColors[file.color]
                  } ${
                    !isActivePdf(file)
                      ? "group-hover:border-l-4 group-hover:pl-1 group-hover:font-bold group-hover:text-gray-90"
                      : ""
                  }`}
                > */}
                <div
                  className={`flex flex-col items-start justify-start`}
                >
                  {/* <div>{file.ticker}</div> */}
                  <div className="text-left" style={{ overflowWrap: 'anywhere' }}>
                    {file?.filename}
                    {/* {file.year} {file.quarter && `Q${file.quarter}`} */}
                  </div>
                </div>
              </button>
            </div>
          ))}
          <div className="h-max w-[80px] flex-grow overflow-hidden border-l"></div>
        </div >
      </div >
    </>
  );
};

export default DisplayMultiplePdfs;
