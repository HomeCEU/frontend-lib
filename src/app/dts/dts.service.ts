import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

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
  public getStatus(): Observable<any> {
    return this.http.get(this.url + 'status', {responseType: 'text'});
  }

  /**
   * Retrieves a list of document templates
   * @param documentType indicates the type of document
   */
  public getTemplates(documentType?: string): Observable<any> {
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
}
