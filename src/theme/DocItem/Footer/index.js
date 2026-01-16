import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import RelatedDocs from '@site/src/components/RelatedDocs';
import PDFExport from '@site/src/components/PDFExport';
import GiscusComponent from '@site/src/components/GiscusComponent';

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <RelatedDocs />
      <div className="margin-top--lg">
        <PDFExport />
      </div>
      <div className="margin-top--lg">
        <GiscusComponent />
      </div>
    </>
  );
}
