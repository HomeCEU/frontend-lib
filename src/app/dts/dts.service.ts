import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Template} from './template.types';

@Injectable({
  providedIn: 'root'
})
export class DtsService {

  constructor(private http: HttpClient) { }

  public getStatus(): Observable<any> {
    return this.http.get(this.url, {responseType: 'text'});
  }

  public getTemplates(searchType: string, searchValue: string): Observable<Template> {
    let url = 'http://localhost:3000/template?filter[' + searchType + ']=' + searchValue;

    return this.http.get(url)
      .pipe(
        map((result: any) => {
          return result.items;
        })
      );

  }
}
