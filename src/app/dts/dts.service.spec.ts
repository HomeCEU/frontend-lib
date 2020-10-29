import {inject, TestBed, waitForAsync} from '@angular/core/testing';
import {DtsService} from './dts.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {of} from 'rxjs';
import {templatesAll, templatesEnrollment} from '../../test/templates';
import {certificate, template} from '../../test/template';

describe('DtsService', () => {
  let service: DtsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler
      ]
    });
    service = TestBed.inject(DtsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an OK status when checking service health', waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const serviceSpy = spyOn(http, 'get').and.returnValue(of('OK'));

      dtsService.getStatus().subscribe(result => {
        expect(result).toEqual('OK');
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));

  it('should return a list of all templates', waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const serviceSpy = spyOn(http, 'get').and.returnValue(of(templatesAll));

      dtsService.getTemplates().subscribe(result => {
        expect(result[0].templateId).toBe('2fa85f64-5717-4562-b3fc-2c963f66afa6');
        expect(result[1].templateId).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
        expect(result[2].templateId).toBe('1fa85f64-5717-4562-b3fc-2c963f66afa6');
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));

  it('should return a templates by document type', waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const serviceSpy = spyOn(http, 'get').and.returnValue(of(templatesEnrollment));

      dtsService.getTemplates('enrollment').subscribe(result => {
        expect(result[0].templateId).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
        expect(result[1].templateId).toBe('1fa85f64-5717-4562-b3fc-2c963f66afa6');
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));

  it('should return a template given a document type and template key', waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const serviceSpy = spyOn(http, 'get').and.returnValue(of(template));

      dtsService.getStatus().subscribe(result => {
        expect(result).toEqual(template);
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));

  it('should return a template populated with data (certificate) given a document type, template key, and data key',
    waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const serviceSpy = spyOn(http, 'get').and.returnValue(of(certificate));

      dtsService.getStatus().subscribe(result => {
        expect(result).toEqual(certificate);
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));

  it('should save a template given a document type, template key, and author', waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const url =  `${dtsService.url}template`;

      const postData = {
        docType: 'enrollment',
        templateKey: 'default-ce',
        author: 'Robert Martin',
        body: template
      };

      const postResponse = {
        templateId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',       /* generated by the backend */
        docType: postData.docType,
        templateKey: postData.templateKey,
        author: postData.author,
        createdAt: '2020-10-23T10:39:22.077Z',                    /* generated by the backend */
        bodyUri: '/template/3fa85f64-5717-4562-b3fc-2c963f66afa6' /* generated by the backend */
      };

      const serviceSpy = spyOn(http, 'post')
        .withArgs(url, postData)
        .and.returnValue(of(postResponse));

      dtsService.saveTemplate(postData.templateKey, postData.author, template).subscribe(result => {
        expect(result).toEqual(postResponse);
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));
});
