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
import { session } from "src/config";
import { useEffect } from "react";
import { useVisionAI } from "~/hooks/uploadedFile/useVisionAI";
import { Toaster } from "react-hot-toast";

ReactGA.initialize(GOOGLE_ANALYTICS_ID);

const MyApp: AppType = ({ Component, pageProps }) => {
  const { isMobile } = useIsMobile()
  const { isTablet } = useIsTablet()
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
