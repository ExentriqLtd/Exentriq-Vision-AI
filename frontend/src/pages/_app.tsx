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
                <CollectionList />
                <Component {...pageProps} />
              </Layout>
            </div>
          </VisionAIProvider>
        </PdfFocusProvider>
      </IntercomProvider>
    </>
  );
};

export default MyApp;
