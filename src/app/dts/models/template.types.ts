/**
 * Template interface
 */
export interface Template {
  id: string;
  docType: string;
  key: string;
  author: string;
  createdAt: {
    date: string,
    timezone_type: number,
    timezone: string
  };
  bodyUri: string;
}

/**
 * Response to preview a certificate with data
 */
export interface RenderedTemplate {
  id: string;
  createdAt: {
    date: string,
    timezone_type: number,
    timezone: string
  };
  location: string;
}

/**
 * Collection of templates
 */
export interface TemplateList {
  total: number;
  items: Template[];
}
