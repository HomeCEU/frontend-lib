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
}

/**
 * Response to preview a certificate with data
 */
export interface RenderedTemplate {
  id: string;
  createdAt: DtsDate;
  location: string;
}

interface DtsDate {
  date: string;
  timezone_type: number;
  timezone: string;
}
