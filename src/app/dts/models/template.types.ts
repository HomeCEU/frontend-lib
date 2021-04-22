/**
 * Template interface
 */
export interface Template {
  id: string;
  docType: string;
  key: string;
  author: string;
  createdAt: DtsDate;
  bodyUri: string;
  metadata?: MetaData;
}

/**
 * Response to preview a certificate with data
 */
export interface RenderedTemplate {
  id: string;
  createdAt: DtsDate;
  location: string;
}

export interface MetaData {
  type: string;
}

interface DtsDate {
  date: string;
  timezone_type: number;
  timezone: string;
}
