/**
 * Utility function to download a file from a blob
 * @param data - The data to download
 * @param filename - The filename to use
 * @param mimeType - The MIME type of the file
 */
export const downloadFile = (data: any, filename: string, mimeType: string) => {
  try {
    // Create a blob with the data and MIME type
    const blob = new Blob([data], { type: mimeType });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');

    // Set the link's properties
    link.href = url;
    link.setAttribute('download', filename);

    // Append the link to the body
    document.body.appendChild(link);

    // Click the link to start the download
    link.click();

    // Remove the link from the body
    link.remove();

    // Release the URL object
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {

    return false;
  }
};

/**
 * Download a PDF file
 * @param data - The PDF data
 * @param filename - The filename to use
 */
export const downloadPdf = (data: any, filename: string) => {
  return downloadFile(
    data,
    filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
    'application/pdf'
  );
};

/**
 * Download a DOCX file
 * @param data - The DOCX data
 * @param filename - The filename to use
 */
export const downloadDocx = (data: any, filename: string) => {
  return downloadFile(
    data,
    filename.endsWith('.docx') ? filename : `${filename}.docx`,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
};

/**
 * Download a TXT file
 * @param data - The TXT data
 * @param filename - The filename to use
 */
export const downloadTxt = (data: any, filename: string) => {
  return downloadFile(
    data,
    filename.endsWith('.txt') ? filename : `${filename}.txt`,
    'text/plain'
  );
};
