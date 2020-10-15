export const template = '<html>\n<head>\n<style>\n.page {\npadding-left: 10px;\npadding-right: 10px;\npage-break-after: auto;\n}\n ' +
  '</style>\n</head>\n<body>\n<div id="container" class="page">\n<p style="text-align:center;">Enrollment #: <span>{{ enrollmentId }}' +
  '</span></p>\n<p><span class="char-style-override-2" style="line-height: 1.2;">Course Certificate</span></p>\n</body>\n</html>';


export const templatesAll = {
  total: 3,
  items: [
    {
      templateId: '2fa85f64-5717-4562-b3fc-2c963f66afa6',
      docType: 'example_type',
      templateKey: 'default-ce',
      author: 'Sue Anderson',
      createdAt: '2020-01-05T23:35:12.876Z',
      bodyUri: '/template/2fa85f64-5717-4562-b3fc-2c963f66afa6'
    },
    {
      templateId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      docType: 'enrollment',
      templateKey: 'default-ce',
      author: 'Robert Martin',
      createdAt: '2020-03-05T23:35:12.876Z',
      bodyUri: '/template/3fa85f64-5717-4562-b3fc-2c963f66afa6'
    },
    {
      templateId: '1fa85f64-5717-4562-b3fc-2c963f66afa6',
      docType: 'enrollment',
      templateKey: 'default-ce',
      author: 'Steve Giles',
      createdAt: '2020-04-05T23:35:12.876Z',
      bodyUri: '/template/2fa85f64-5717-4562-b3fc-2c963f66afa6'
    }
  ]
};

export const templatesEnrollment = {
  total: 2,
  items: [
    {
      templateId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      docType: 'enrollment',
      templateKey: 'default-ce',
      author: 'Robert Martin',
      createdAt: '2020-03-05T23:35:12.876Z',
      bodyUri: '/template/3fa85f64-5717-4562-b3fc-2c963f66afa6'
    },
    {
      templateId: '1fa85f64-5717-4562-b3fc-2c963f66afa6',
      docType: 'enrollment',
      templateKey: 'default-ce',
      author: 'Steve Giles',
      createdAt: '2020-04-05T23:35:12.876Z',
      bodyUri: '/template/2fa85f64-5717-4562-b3fc-2c963f66afa6'
    }
  ]
};
