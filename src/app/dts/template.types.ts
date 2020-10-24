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
 * Collection of templates
 */
export interface TemplateList {
  total: number;
  items: Template[];
}
