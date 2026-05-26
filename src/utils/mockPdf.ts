export const downloadMockPdf = ({
  fileName,
  title,
  lines,
}: {
  fileName: string;
  title: string;
  lines: string[];
}) => {
  if (typeof window === 'undefined') {
    return;
  }

  const body = [title, '', ...lines, '', 'Documento de referencia BUNTY'].join('\n');
  const blob = new Blob([body], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
};

export default downloadMockPdf;
