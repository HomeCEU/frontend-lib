CKEDITOR.editorConfig = function( config ) {
	// Defines changes to default configuration
	// For complete reference see:
	// https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html

  config.extraPlugins = 'datafield, sourcedialog';

  config.removePlugins = 'exportpdf';

  config.toolbar = [
    { name: 'document', items: ['Source'] },
    { name: 'clipboard', items: [ 'Cut', 'Copy', '-', 'Undo', 'Redo' ] },
    { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
    { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', '-', 'CopyFormatting', 'RemoveFormat'  ] },
    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },

    '/',
    { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
    { name: 'colors', items: [ 'TextColor', 'BGColor' ] }
  ];
  config.height = '60vh';
  config.fullPage = true;
  config.startupMode = 'wysiwyg';
  config.allowedContent = true;
  config.fullPage = true;
  config.height = '60vh';
};
