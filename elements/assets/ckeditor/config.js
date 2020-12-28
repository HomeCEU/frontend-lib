CKEDITOR.editorConfig = function( config ) {
	// Defines changes to default configuration
	// For complete reference see:
	// https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html

  config.extraPlugins = 'hcard, sourcedialog';

  config.toolbar = [
    { name: 'basicstyles', items: [ 'Bold', 'Italic' ] },
    { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo' ] },
    { name: 'document', items: ['Source'] }
  ];
  config.startupMode = 'source';
  config.allowedContent = true;
  config.fullPage = true;
  config.height = '500px';
};
