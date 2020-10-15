export const template = `
<html>

<head>
  <meta charset='utf-8'>
<meta http-equiv='X-UA-Compatible' content='IE=EmulateIE8' />
  <style>
  @page {
  size: letter portrait;
}

html,
  body {
  font-family: 'Minion Pro', serif;
  width: 98%;
  text-align: center;
  position: relative;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  border: 10px solid #000;
  margin: 1cm;
  padding: 5px;
  box-sizing: border-box;
  color: #000000;
}

html,
  body {
  height: 100%;
}

.page {
  padding-left: 10px;
  padding-right: 10px;
  page-break-after: auto;
}

.page-divider {
  page-break-after: always;
}

span.char-style-override-1 {
  font-size: 1.3em;
  font-weight: bold;
}

span.char-style-override-2 {
  font-size: 3em;
  font-weight: bold;
}

span.char-style-override-3 {
  font-size: 1.17em;
}

span.char-style-override-4 {
  font-size: 1.33em;
  font-weight: bold;
}

span.char-style-override-5 {
  font-size: 0.55em;
}

span.char-style-override-6 {
  font-weight: bold;
}

span.char-style-override-7 {
  font-size: 1.4em;
  font-weight: bold;
}

p {
  font-family: 'Minion Pro', serif;
  font-size: 1em;
  line-height: 1.2;
  text-align: center;
}

p.header_images {
  text-align: left;
}

img {
  margin: 5px 5px 5px 5px;
}
</style>
</head>

<body>
<div id='container' class='page'>
<p style='text-align:center;'>Enrollment #: <span class='char-style-override-6'>{{ enrollmentId }}</span></p>
<p><span class='char-style-override-2' style='line-height: 1.2;'>Course Certificate</span></p>
<p><span class='char-style-override-3'>This is to certify</span></p>
<p><span class='char-style-override-1'>{{ student.firstName }} {{ student.lastName }}&nbsp;-&nbsp;{{~#each student.licenses as |license|~}}{{license.state}} {{license.type}} {{license.number}}{{#unless @last}}; {{/unless}}{{~/each~}}</span>
</p>
<p><span>has successfully completed </span><span class='char-style-override-1'>{{ course.hours }} contact hours</span><span>{{#if (eq course.format 'live')}}Live Continuing Education{{else}}continuing education online training{{/if}} on the topic of:</span>
</p>
<p><span class='char-style-override-4'>{{ course.name }}</span><br/>{{#if course.authors}}{{#with course.authors as |authors|}}Course Speakers:{{#each authors~}}{{this}}{{#unless @last}} | {{/unless}}{{~/each}}{{/with}}{{/if}}</p>
<p><span>Presented by HomeCEUConnection.com, 5048 Tennyson Pkwy, Suite 200 Plano TX 75024</span></p>
<p><span>Course completed on {{ completionDate }}</span></p>
</div>
</body>

</html><html>

<head>
<meta charset='utf-8'>
<meta http-equiv='X-UA-Compatible' content='IE=EmulateIE8' />
  <style>
  @page {
  size: letter portrait;
}

  html,
    body {
    font-family: 'Minion Pro', serif;
    width: 98%;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    border: 10px solid #000;
    margin: 1cm;
    padding: 5px;
    box-sizing: border-box;
    color: #000000;
  }

  html,
    body {
    height: 100%;
  }

.page {
    padding-left: 10px;
    padding-right: 10px;
    page-break-after: auto;
  }

.page-divider {
    page-break-after: always;
  }

  span.char-style-override-1 {
    font-size: 1.3em;
    font-weight: bold;
  }

  span.char-style-override-2 {
    font-size: 3em;
    font-weight: bold;
  }

  span.char-style-override-3 {
    font-size: 1.17em;
  }

  span.char-style-override-4 {
    font-size: 1.33em;
    font-weight: bold;
  }

  span.char-style-override-5 {
    font-size: 0.55em;
  }

  span.char-style-override-6 {
    font-weight: bold;
  }

  span.char-style-override-7 {
    font-size: 1.4em;
    font-weight: bold;
  }

  p {
    font-family: 'Minion Pro', serif;
    font-size: 1em;
    line-height: 1.2;
    text-align: center;
  }

  p.header_images {
    text-align: left;
  }

  img {
    margin: 5px 5px 5px 5px;
  }
  </style>
  </head>

  <body>
  <div id='container' class='page'>
  <p style='text-align:center;'>Enrollment #: <span class='char-style-override-6'>{{ enrollmentId }}</span></p>
  <p><span class='char-style-override-2' style='line-height: 1.2;'>Course Certificate</span></p>
  <p><span class='char-style-override-3'>This is to certify</span></p>
  <p><span class='char-style-override-1'>{{ student.firstName }} {{ student.lastName }}&nbsp;-&nbsp;{{~#each student.licenses as |license|~}}{{license.state}} {{license.type}} {{license.number}}{{#unless @last}}; {{/unless}}{{~/each~}}</span>
  </p>
  <p><span>has successfully completed </span><span class='char-style-override-1'>{{ course.hours }} contact hours</span><span>{{#if (eq course.format 'live')}}Live Continuing Education{{else}}continuing education online training{{/if}} on the topic of:</span>
  </p>
  <p><span class='char-style-override-4'>{{ course.name }}</span><br/>{{#if course.authors}}{{#with course.authors as |authors|}}Course Speakers:{{#each authors~}}{{this}}{{#unless @last}} | {{/unless}}{{~/each}}{{/with}}{{/if}}</p>
  <p><span>Presented by HomeCEUConnection.com, 5048 Tennyson Pkwy, Suite 200 Plano TX 75024</span></p>
  <p><span>Course completed on {{ completionDate }}</span></p>
  </div>
  </body>

  </html><html>

  <head>
  <meta charset='utf-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=EmulateIE8' />
    <style>
    @page {
    size: letter portrait;
  }

    html,
      body {
      font-family: 'Minion Pro', serif;
      width: 98%;
      text-align: center;
      position: relative;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      border: 10px solid #000;
      margin: 1cm;
      padding: 5px;
      box-sizing: border-box;
      color: #000000;
    }

    html,
      body {
      height: 100%;
    }

  .page {
      padding-left: 10px;
      padding-right: 10px;
      page-break-after: auto;
    }

  .page-divider {
      page-break-after: always;
    }

    span.char-style-override-1 {
      font-size: 1.3em;
      font-weight: bold;
    }

    span.char-style-override-2 {
      font-size: 3em;
      font-weight: bold;
    }

    span.char-style-override-3 {
      font-size: 1.17em;
    }

    span.char-style-override-4 {
      font-size: 1.33em;
      font-weight: bold;
    }

    span.char-style-override-5 {
      font-size: 0.55em;
    }

    span.char-style-override-6 {
      font-weight: bold;
    }

    span.char-style-override-7 {
      font-size: 1.4em;
      font-weight: bold;
    }

    p {
      font-family: 'Minion Pro', serif;
      font-size: 1em;
      line-height: 1.2;
      text-align: center;
    }

    p.header_images {
      text-align: left;
    }

    img {
      margin: 5px 5px 5px 5px;
    }
    </style>
    </head>

    <body>
    <div id='container' class='page'>
    <p style='text-align:center;'>Enrollment #: <span class='char-style-override-6'>{{ enrollmentId }}</span></p>
    <p><span class='char-style-override-2' style='line-height: 1.2;'>Course Certificate</span></p>
    <p><span class='char-style-override-3'>This is to certify</span></p>
    <p><span class='char-style-override-1'>{{ student.firstName }} {{ student.lastName }}&nbsp;-&nbsp;{{~#each student.licenses as |license|~}}{{license.state}} {{license.type}} {{license.number}}{{#unless @last}}; {{/unless}}{{~/each~}}</span>
    </p>
    <p><span>has successfully completed </span><span class='char-style-override-1'>{{ course.hours }} contact hours</span><span>{{#if (eq course.format 'live')}}Live Continuing Education{{else}}continuing education online training{{/if}} on the topic of:</span>
    </p>
    <p><span class='char-style-override-4'>{{ course.name }}</span><br/>{{#if course.authors}}{{#with course.authors as |authors|}}Course Speakers:{{#each authors~}}{{this}}{{#unless @last}} | {{/unless}}{{~/each}}{{/with}}{{/if}}</p>
    <p><span>Presented by HomeCEUConnection.com, 5048 Tennyson Pkwy, Suite 200 Plano TX 75024</span></p>
    <p><span>Course completed on {{ completionDate }}</span></p>
    </div>
    </body>

    </html><html>

    <head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=EmulateIE8' />
      <style>
      @page {
      size: letter portrait;
    }

      html,
        body {
        font-family: 'Minion Pro', serif;
        width: 98%;
        text-align: center;
        position: relative;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        border: 10px solid #000;
        margin: 1cm;
        padding: 5px;
        box-sizing: border-box;
        color: #000000;
      }

      html,
        body {
        height: 100%;
      }

    .page {
        padding-left: 10px;
        padding-right: 10px;
        page-break-after: auto;
      }

    .page-divider {
        page-break-after: always;
      }

      span.char-style-override-1 {
        font-size: 1.3em;
        font-weight: bold;
      }

      span.char-style-override-2 {
        font-size: 3em;
        font-weight: bold;
      }

      span.char-style-override-3 {
        font-size: 1.17em;
      }

      span.char-style-override-4 {
        font-size: 1.33em;
        font-weight: bold;
      }

      span.char-style-override-5 {
        font-size: 0.55em;
      }

      span.char-style-override-6 {
        font-weight: bold;
      }

      span.char-style-override-7 {
        font-size: 1.4em;
        font-weight: bold;
      }

      p {
        font-family: 'Minion Pro', serif;
        font-size: 1em;
        line-height: 1.2;
        text-align: center;
      }

      p.header_images {
        text-align: left;
      }

      img {
        margin: 5px 5px 5px 5px;
      }
      </style>
      </head>

      <body>
      <div id='container' class='page'>
      <p style='text-align:center;'>Enrollment #: <span class='char-style-override-6'>{{ enrollmentId }}</span></p>
      <p><span class='char-style-override-2' style='line-height: 1.2;'>Course Certificate</span></p>
      <p><span class='char-style-override-3'>This is to certify</span></p>
      <p><span class='char-style-override-1'>{{ student.firstName }} {{ student.lastName }}&nbsp;-&nbsp;{{~#each student.licenses as |license|~}}{{license.state}} {{license.type}} {{license.number}}{{#unless @last}}; {{/unless}}{{~/each~}}</span>
      </p>
      <p><span>has successfully completed </span><span class='char-style-override-1'>{{ course.hours }} contact hours</span><span>{{#if (eq course.format 'live')}}Live Continuing Education{{else}}continuing education online training{{/if}} on the topic of:</span>
      </p>
      <p><span class='char-style-override-4'>{{ course.name }}</span><br/>{{#if course.authors}}{{#with course.authors as |authors|}}Course Speakers:{{#each authors~}}{{this}}{{#unless @last}} | {{/unless}}{{~/each}}{{/with}}{{/if}}</p>
      <p><span>Presented by HomeCEUConnection.com, 5048 Tennyson Pkwy, Suite 200 Plano TX 75024</span></p>
      <p><span>Course completed on {{ completionDate }}</span></p>
      </div>
      </body>

      </html><html>

      <head>
      <meta charset='utf-8'>
      <meta http-equiv='X-UA-Compatible' content='IE=EmulateIE8' />
        <style>
        @page {
        size: letter portrait;
      }

        html,
          body {
          font-family: 'Minion Pro', serif;
          width: 98%;
          text-align: center;
          position: relative;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          border: 10px solid #000;
          margin: 1cm;
          padding: 5px;
          box-sizing: border-box;
          color: #000000;
        }

        html,
          body {
          height: 100%;
        }

      .page {
          padding-left: 10px;
          padding-right: 10px;
          page-break-after: auto;
        }

      .page-divider {
          page-break-after: always;
        }

        span.char-style-override-1 {
          font-size: 1.3em;
          font-weight: bold;
        }

        span.char-style-override-2 {
          font-size: 3em;
          font-weight: bold;
        }

        span.char-style-override-3 {
          font-size: 1.17em;
        }

        span.char-style-override-4 {
          font-size: 1.33em;
          font-weight: bold;
        }

        span.char-style-override-5 {
          font-size: 0.55em;
        }

        span.char-style-override-6 {
          font-weight: bold;
        }

        span.char-style-override-7 {
          font-size: 1.4em;
          font-weight: bold;
        }

        p {
          font-family: 'Minion Pro', serif;
          font-size: 1em;
          line-height: 1.2;
          text-align: center;
        }

        p.header_images {
          text-align: left;
        }

        img {
          margin: 5px 5px 5px 5px;
        }
        </style>
        </head>

        <body>
        <div id='container' class='page'>
        <p style='text-align:center;'>Enrollment #: <span class='char-style-override-6'>{{ enrollmentId }}</span></p>
        <p><span class='char-style-override-2' style='line-height: 1.2;'>Course Certificate</span></p>
        <p><span class='char-style-override-3'>This is to certify</span></p>
        <p><span class='char-style-override-1'>{{ student.firstName }} {{ student.lastName }}&nbsp;-&nbsp;{{~#each student.licenses as |license|~}}{{license.state}} {{license.type}} {{license.number}}{{#unless @last}}; {{/unless}}{{~/each~}}</span>
        </p>
        <p><span>has successfully completed </span><span class='char-style-override-1'>{{ course.hours }} contact hours</span><span>{{#if (eq course.format 'live')}}Live Continuing Education{{else}}continuing education online training{{/if}} on the topic of:</span>
        </p>
        <p><span class='char-style-override-4'>{{ course.name }}</span><br/>{{#if course.authors}}{{#with course.authors as |authors|}}Course Speakers:{{#each authors~}}{{this}}{{#unless @last}} | {{/unless}}{{~/each}}{{/with}}{{/if}}</p>
        <p><span>Presented by HomeCEUConnection.com, 5048 Tennyson Pkwy, Suite 200 Plano TX 75024</span></p>
        <p><span>Course completed on {{ completionDate }}</span></p>
        </div>
        </body>

        </html>`;
