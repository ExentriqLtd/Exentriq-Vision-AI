import { type AppType } from "next/dist/shared/lib/utils";
import Layout from "~/components/Layout";
import "~/styles/globals.css";
import ReactGA from "react-ga4";

import { IntercomProvider } from "react-use-intercom";
import { GOOGLE_ANALYTICS_ID, INTERCOM_ID } from "~/constants";
import CollectionList from "./section/leftSidebar";
import { VisionAIProvider } from "~/hooks/uploadedFile/VisionAIProvider";
import { PdfFocusProvider } from "~/context/pdf";
import useIsMobile from "~/hooks/utils/useIsMobile";
import useIsTablet from "~/hooks/utils/useIsTablet";
import { getUrlParams, session } from "src/config";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AppProps } from 'next/app';
import { BiLoaderAlt } from "react-icons/bi";

// ReactGA.initialize(GOOGLE_ANALYTICS_ID);

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const { isMobile } = useIsMobile();
  const { isTablet } = useIsTablet();

  const [urlParamsLoaded, setUrlParamsLoaded] = useState(false);

    useEffect(() => {
        // Chiama la funzione asincrona getUrlParams per ottenere i valori dall'URL
        getUrlParams().then(() => {
        // Imposta lo stato a true per indicare che i parametri URL sono stati caricati
          setUrlParamsLoaded(true);
        });
    }, []);

    // Se i parametri URL non sono ancora stati caricati, visualizza uno spinner o un messaggio di caricamento
    if (!urlParamsLoaded) {
        return <div className="flex h-[100vh] w-[100vw] items-center justify-center"><BiLoaderAlt className="animate-spin" color="#1bbc9b" size={48} /></div>;
    }

  return (
    <>
      <IntercomProvider appId={INTERCOM_ID}>
        <PdfFocusProvider>
          <VisionAIProvider>
            <div className={`${(!isMobile || !isTablet) && 'flex flex-row'} h-[100vh]`}>
              <Layout>
                {!session.embed &&
                  <CollectionList />
                }
                <Component {...pageProps} />
                <Toaster />
              </Layout>
            </div>
          </VisionAIProvider>
        </PdfFocusProvider>
      </IntercomProvider>
    </>
  );
};

export default MyApp;
