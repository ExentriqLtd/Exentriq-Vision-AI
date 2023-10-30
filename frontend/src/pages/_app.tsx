import { type AppType } from "next/dist/shared/lib/utils";
import Layout from "~/components/Layout";
import "~/styles/globals.css";
import ReactGA from "react-ga4";

import { IntercomProvider } from "react-use-intercom";
import { GOOGLE_ANALYTICS_ID, INTERCOM_ID } from "~/constants";
import CollectionList from "./section/leftSidebar";
import { UploadedFileProvider } from "~/hooks/uploadedFile/UploadedFileProvider";
import { PdfFocusProvider } from "~/context/pdf";

ReactGA.initialize(GOOGLE_ANALYTICS_ID);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <IntercomProvider appId={INTERCOM_ID}>
        <PdfFocusProvider>
          <UploadedFileProvider>
            <div className="flex flex-row h-[100vh]">
              <Layout>
                <CollectionList />
                <Component {...pageProps} />
              </Layout>
            </div>
          </UploadedFileProvider>
        </PdfFocusProvider>
      </IntercomProvider>
    </>
  );
};

export default MyApp;
