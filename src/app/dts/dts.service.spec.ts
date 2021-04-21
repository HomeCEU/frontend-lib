import {inject, TestBed, waitForAsync} from '@angular/core/testing';
import {DtsService} from './dts.service';
import {HttpClient, HttpHandler, HttpHeaders, HttpParams} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {templatesAll, templatesEnrollment, templatesImage, templatesPartial} from '../../test/templates';
import {template} from '../../test/template';
import {documentData} from 'src/test/document-data';
import {TemplateTypeEnum} from './models/templateTypeEnum';

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

      dtsService.getTemplates(TemplateTypeEnum.template).subscribe(result => {
        expect(result[0].id).toBe('2fa85f64-5717-4562-b3fc-2c963f66afa6');
        expect(result[1].id).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
        expect(result[2].id).toBe('1fa85f64-5717-4562-b3fc-2c963f66afa6');
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));

  it('should return a templates by template type', waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const serviceSpy = spyOn(http, 'get').and.returnValue(of(templatesPartial));

      dtsService.getTemplates(TemplateTypeEnum.partial).subscribe(result => {
        expect(result[0].id).toBe('024a5bfc-4fd4-4193-a4ac-2eccd9911259');
        expect(result[1].id).toBe('102fe464-8946-43a1-af5c-9101f22744c8');
        expect(result[2].id).toBe('1e3269aa-a4a5-40d9-afba-3a01c222685e');
        expect(result[3].id).toBe('23041b7b-0584-4546-9b5e-03b085d6b5b1');
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));

  it('should return a template given a template type and template key', waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const serviceSpy = spyOn(http, 'get').and.returnValue(of(templatesEnrollment));


      dtsService.getTemplatesByKey(TemplateTypeEnum.template, 'NutritionTemplate').subscribe(result => {
        expect(result).toEqual([templatesEnrollment.items[0]]);
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));

  it('should return a partial template given a template type and template key', waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const serviceSpy = spyOn(http, 'get').and.returnValue(of(templatesPartial));

      dtsService.getTemplatesByKey(TemplateTypeEnum.partial, 'pt-pta').subscribe(result => {
        expect(result).toEqual([templatesPartial.items[1]]);
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));

  it('should return an image template given a template type and template key', waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const serviceSpy = spyOn(http, 'get').and.returnValue(of(templatesImage));

      dtsService.getTemplatesByKey(TemplateTypeEnum.image, 'acp_john_tawfik_signature.png').subscribe(result => {
        expect(result).toEqual([templatesImage.items[0]]);
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));

  it('should retrieve document data given a document id', waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const serviceSpy = spyOn(http, 'get').and.returnValue(of(documentData));

      dtsService.getDocumentData('').subscribe((result: any) => {
        expect(result).toEqual(documentData.data);
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));

  it('should return template content given a template id', waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const serviceSpy = spyOn(http, 'get').and.returnValue(of(template));

      dtsService.getTemplateContentById(null, '00884fc8-eaac-485c-91d8-72c8b582a530').subscribe((result: any) => {
        expect(result).toEqual(template);
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));

  it('should retrieve a hot render response given template content and data', waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
    const hotRenderResponse = {
      id: '34b3a03c-9e28-11eb-b49c-0242ac110003',
      createdAt: {
        date: '2021-04-15 20:21:48.500043',
        timezone_type: 3,
        timezone: 'UTC'
      },
      location: '/api/v1/hotrender/34b3a03c-9e28-11eb-b49c-0242ac110003'
    };
    const serviceSpy = spyOn(http, 'post').and.returnValue(of(hotRenderResponse));

    dtsService.hotRenderTemplate('', '').subscribe((result: any) => {
      expect(result).toEqual(hotRenderResponse);
      expect(serviceSpy).toHaveBeenCalled();
    });
  })));

  it('should save a template given a document type, template key, and author', waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const url =  `${dtsService.url}/template`;

      const postData = {
        docType: 'enrollment',
        key: 'default-ce',
        author: 'Robert Martin',
        body: template,
        metadata: {
          type: 'template'
        }
      };

      const postResponse = {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',       /* generated by the backend */
        docType: postData.docType,
        key: postData.key,
        author: postData.author,
        createdAt: {
          date: '2020-03-23 15:40:06.000000',
          timezone_type: 3,
          timezone: 'UTC'
        },
        bodyUri: '/template/3fa85f64-5717-4562-b3fc-2c963f66afa6' /* generated by the backend */
      };

      const serviceSpy = spyOn(http, 'post')
        .withArgs(url, postData)
        .and.returnValue(of(postResponse));

      dtsService.saveTemplate(TemplateTypeEnum.template, postData.key, postData.author, template).subscribe(result => {
        expect(result).toEqual(postResponse);
        expect(serviceSpy).toHaveBeenCalled();
      });
    })));

  it('should handle an error when saving a template given a document type, template key, and author',
    waitForAsync(inject([DtsService, HttpClient],
    (dtsService: DtsService, http: HttpClient) => {
      const url =  `${dtsService.url}/template`;

      const postData = {
        docType: 'enrollment',
        key: 'default-ce',
        author: 'Robert Martin',
        body: template,
        metadata: {
          type: 'template'
        }
      };

      spyOn(http, 'post')
        .withArgs(url, postData)
        .and.returnValue(throwError({
          error: {
            code: 400,
          }
        }));

      let saveError = null;
      dtsService.saveTemplate(TemplateTypeEnum.template, postData.key, postData.author, template).subscribe(
        () => { },
        err => {
          saveError = err;
        });

      expect(saveError.error.code).toEqual(400);
    })));
});
