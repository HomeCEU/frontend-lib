CKEDITOR.editorConfig = function( config ) {
	// Defines changes to default configuration
	// For complete reference see:
	// https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html

  config.extraPlugins = 'datafield, sourcedialog';

  config.removePlugins = 'exportpdf';

  config.toolbar = [
    { name: 'basicstyles', items: [ 'Bold', 'Italic' ] },
    { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo' ] },
    { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
    { name: 'document', items: ['Source'] },
    '/',
    { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
  ];
  config.startupMode = 'wysiwyg';
  config.allowedContent = true;
  config.fullPage = true;
  config.height = '800px';
};
