import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {MetaData, RenderedTemplate, Template} from './models/template.types';
import {DocData} from './models/docData.types';
import {TemplateTypeEnum} from './models/templateTypeEnum';

@Injectable({
  providedIn: 'root'
})
export class DtsService {

  /**
   * Creates an instance of the service.
   * @param http connection to the backend DTS service
   */
  constructor(private http: HttpClient) { }

  /**
   * URL to the DTS Service.
   */
  url: string;

  private static containsTemplateType(item: Template, templateType: TemplateTypeEnum): boolean {
    return item.hasOwnProperty('metadata') && item.metadata.hasOwnProperty('type') && item.metadata.type.includes(templateType);
  }

  private static getTemplateTypeFromObject(metaData: MetaData): string {
    return (metaData && (metaData.type.includes(TemplateTypeEnum.partial) ||
      metaData.type.includes(TemplateTypeEnum.image))) ? TemplateTypeEnum.partial : TemplateTypeEnum.template;
  }

  /**
   * Retrieves and indication is the backend DTS service is healthy.
   */
  public getStatus(): Observable<string> {
    return this.http.get(this.url + '/status', {responseType: 'text'}).pipe(catchError( error => {
      return throwError(error);
    }));
  }

  /**
   * Retrieves a list of document templates
   */
  public getTemplates(templateType: TemplateTypeEnum): Observable<Template[]> {
    const searchType = (templateType === TemplateTypeEnum.template) ? TemplateTypeEnum.template : TemplateTypeEnum.partial;
    const url = `${this.url}/${searchType}?docType=enrollment`;

    return this.http.get(url)
      .pipe(map((result: any) => {
        if (templateType === TemplateTypeEnum.partial || templateType === TemplateTypeEnum.image) {
          return result.items.filter(item => DtsService.containsTemplateType(item, templateType));
        }
        return result.items;
      }));
  }

  /**
   * Get templates by template type and key
   * @param templateType type of template
   * @param templateKey name of template
   */
  public getTemplatesByKey(templateType: TemplateTypeEnum, templateKey: string): Observable<Template[]> {
    const searchType = (templateType === TemplateTypeEnum.template) ? TemplateTypeEnum.template : TemplateTypeEnum.partial;
    const url = `${this.url}/${searchType}?docType=enrollment`;

    return this.http.get(url)
      .pipe(map((result: any) => {
        if (templateType === TemplateTypeEnum.partial || templateType === TemplateTypeEnum.image) {
          return result.items.filter(item => DtsService.containsTemplateType(item, templateType) && item.key === templateKey);
        }
        else {
          return result.items.filter(item => item.key === templateKey);
        }
      }));
  }

  /**
   * Retrieves template content (i.e. html) by template id
   * @param metaData data indicating template type
   * @param templateId unique data identifier
   */
  public getTemplateContentById(metaData: MetaData, templateId: string): Observable<string> {
    const url =  `${this.url}/${DtsService.getTemplateTypeFromObject(metaData)}/${templateId}`;

    return this.http.get(url, {responseType: 'text'}).pipe(catchError( () => {
      return of(null);
    }));
  }

  /**
   * Retrieves document data by an associated data key
   * @param dataKey unique data identifier
   */
  public getDocumentData(dataKey: string): Observable<string> {
    const url =  `${this.url}/docdata/enrollment/${dataKey}`;

    return this.http.get(url).pipe(
      map((result: DocData) => {
      return result.data;
    }));
  }

  /**
   * Retrieves a url to launch a rendered template as a certificate populated with data given template content and its associated data
   * @param templateContent source for template
   * @param dataContent data for template
   */
  public hotRenderTemplate(templateContent: string, dataContent: string): Observable<RenderedTemplate> {
    const url =  `${this.url}/hotrender`;
    const partialFieldIndicator = /&gt;/gi;

    templateContent = templateContent.replace(partialFieldIndicator, '>');

    const postData = {
      template: templateContent,
      data: dataContent,
      docType: 'enrollment'
    };

    return this.http.post<RenderedTemplate>(url, postData).pipe(catchError( error => {
      return throwError(error);
    }));
  }

  /**
   * Saves a template
   * @param templateType type of template
   * @param templateKeyValue unique template identifier
   * @param authorValue person saving/modifying this template
   * @param bodyValue html certificate template content
   */
  public saveTemplate(templateType: TemplateTypeEnum, templateKeyValue: string, authorValue: string,
                      bodyValue: string): Observable<Template> {
    const searchType = (templateType === TemplateTypeEnum.template) ? TemplateTypeEnum.template : TemplateTypeEnum.partial;
    const url = `${this.url}/${searchType}`;

    const postData = {
      docType: 'enrollment',
      key: templateKeyValue,
      author: authorValue,
      body: bodyValue,
      metadata: {
        type: templateType
      }
    };

    return this.http.post<Template>(url, postData).pipe(catchError( error => {
      return throwError(error);
    }));
  }
}
