export const TemplateAdminApproved = `<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8"/>
    <style>
        {{> standard_certificate_style}}
    </style>
</head>

<body>
<div id="container" class="page">

    <p class="header_images">
        {{> homeceu_logo.png }}
    </p>

    <p style="text-align:center;">
        Enrollment #: <span class="char-style-override-6">{{ enrollmentId }}</span>
    </p>

    <p>
        <span class="char-style-override-3">This is to acknowledge that </span>
        <span class="char-style-override-1">{{> student_name}}</span>
    </p>

    <p>
        <span class="char-style-override-3">Has completed </span>
        <span class="char-style-override-1">{{ course.name }}</span>
    </p>

    <p class="char-style-override-3">
        a {{ course.hours }} hour development and/or training program
    </p>
    <p>
        <span class="char-style-override-3"> via </span>
        <span class="char-style-override-1">{{ completion_method }}</span>
    </p>

    <p>
        <span class="char-style-override-3"> on </span>
        <span class="char-style-override-1">{{ completionDate }}</span>
    </p>

    <p>
        {{ supervisor.first_name }} {{ supervisor.last_name }} has indicated completion for this user.
    </p>

    <p>
        The awarding of this certificate does not award continuing education hours / credit.
    </p>
</div>
</body>
</html>
`;
