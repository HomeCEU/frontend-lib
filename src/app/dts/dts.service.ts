import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Template} from './template.types';

@Injectable({
  providedIn: 'root'
})
export class DtsService {

  /**
   * URL to the DTS Service.  TODO: Currently using a local instance of the service as the service is in development and not live.
   */
  url = environment.dtsUrl;

  /**
   * Creates an instance of the service.
   * @param http connection to the backend DTS service
   */
  constructor(private http: HttpClient) { }

  /**
   * Retrieves and indication is the backend DTS service is healthy.
   */
  public getStatus(): Observable<string> {
    return this.http.get(this.url + 'status', {responseType: 'text'});
  }

  /**
   * Retrieves a list of document templates
   * @param documentType indicates the type of document
   */
  public getTemplates(documentType?: string): Observable<Template[]> {
    let url = this.url + 'template';

    // Query by the document type
    if (documentType) {
      url = url + '?filter[type]=' + documentType;
    }

    return this.http.get(url)
      .pipe(map((result: any) => {
          return result.items;
        })
      );
  }

  /**
   * Gets an HTML template body by document type and template key
   * @param documentType currently limited to 'enrollment'
   * @param templateKey unique template identifier
   */
  public getTemplateByKey(documentType: string, templateKey: string): Observable<string> {
    const url =  `${this.url}template/${documentType}/${templateKey}`;

    return this.http.get(url, {responseType: 'text'});
  }

  /**
   * Retrieves a rendered template as a certificate populated with data
   * @param documentType currently limited to 'enrollment'
   * @param templateKey unique template identifier
   * @param dataKey unique data identifier
   */
  public renderTemplate(documentType: string, templateKey: string, dataKey: string): Observable<string> {
    const url =  `${this.url}render/${documentType}/${templateKey}/${dataKey}`;

    return this.http.get(url, {responseType: 'text'});
  }

  /**
   * Saves a template
   * @param templateKeyValue unique template identifier
   * @param authorValue person saving/modifying this template
   * @param bodyValue html certificate template content
   */
  public saveTemplate(templateKeyValue: string, authorValue: string, bodyValue: string): Observable<Template> {
    const url =  `${this.url}template`;

    const postData = {
      docType: 'enrollment',
      templateKey: templateKeyValue,
      author: authorValue,
      body: bodyValue
    };

    return this.http.post<Template>(url, postData);
  }
}
