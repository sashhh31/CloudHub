// utils/fileParser.ts
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

interface FileWithArrayBuffer extends File {
  arrayBuffer(): Promise<ArrayBuffer>;
}

export async function parseResumeFile(file: FileWithArrayBuffer): Promise<string> {
  try {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let text = '';
    
    switch (fileType) {
      case 'pdf':
        const pdfData = await pdf(buffer);
        text = pdfData.text;
        break;
      case 'docx':
        const docxResult = await mammoth.extractRawText({ buffer });
        text = docxResult.value;
        break;
      case 'txt':
        text = buffer.toString('utf8');
        break;
      case 'json':
        // For LinkedIn exports
        text = buffer.toString('utf8');
        break;
      default:
        throw new Error('Unsupported file format');
    }
    
    return text;
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error('Failed to parse file');
  }
}