import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function PDFExport() {
  const handleExport = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <BrowserOnly>
      {() => (
        <button className="pdf-export-btn" type="button" onClick={handleExport}>
          Export as PDF
        </button>
      )}
    </BrowserOnly>
  );
}
