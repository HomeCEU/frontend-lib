/**
 * Template interface
 */
export interface Template {
  templateId: string;
  docType: string;
  templateKey: string;
  author: string;
  createdAt: string;
  bodyUri: string;
}

/**
 * Response to preview a certificate with data
 */
export interface RenderedTemplate {
  requestId: string;
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
