
export function readFileAsText(inputFile: Blob): Promise<string> {
  const temporaryFileReader = new FileReader();
  
  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(String(temporaryFileReader.result));
    };
    temporaryFileReader.readAsText(inputFile);
  });

}