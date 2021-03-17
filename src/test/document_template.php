<?php
/**
 * Test file for consuming the Angular frontend dts component in a PHP application (i.e. CEMS)
 *
 * To manually test this code locally without CEMS:
 * - In your local webroot (i.e. Apache Tomcat), create the folder \bundles\cemscore\frontend
 * - From frontend-lib/elements copy
 *   - assets to \bundles\cemscore\frontend\assets
 *   - styles.css and data-table.woff to \bundles\cemscore\frontend\css
 *   - frontend-lib.js to \bundles\cemscore\frontend\script
 * - Copy this file to any folder in your webroot
 * - Open this file in your browser
 *
 */

  $dtsUrl = "http://dts-qa.us-west-2.elasticbeanstalk.com";
  class User
  {
    var $userName;

    public function __construct(string $name)
    {
      $this->userName = $name;
    }
  }
  $user = new User("Test User");
?>

<!doctype>
<html>
  <head>
    <title>Certificate Template</title>
    <link href="/bundles/cemscore/frontend/css/styles.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
    <script type="text/javascript" src="/bundles/cemscore/frontend/assets/ckeditor/ckeditor.js"></script>
    <meta charset="UTF-8">
  </head>
  <body>
    <!--app-dts userName={{ user.username }} dtsUrl={{ dtsUrl }}></app-dts> -->
    <app-dts userName = <?php echo $user->userName;?>  dtsUrl = <?php echo $dtsUrl;?> </app-dts>
    <script type="text/javascript" src="/bundles/cemscore/frontend/scripts/frontend-lib.js"></script>
  </body>
</html>
