CKEDITOR.plugins.add('hcard', {
  requires: 'widget',

  init(editor) {
    editor.widgets.add('hcard', {
      allowedContent: 'span(!data-field); a[href](!p-name);',
      requiredContent: 'span(data-field)',
      pathName: 'hcard',

      upcast: (el) => {
        return el.name === 'span' && el.hasClass('data-field');
      }
    });

    // This feature does not have a button, so it needs to be registered manually.
    editor.addFeature(editor.widgets.registered.hcard);

    // Handle dropping a contact by transforming the contact object into HTML.
    // Note: All pasted and dropped content is handled in one event - editor#paste.
    editor.on('paste', (evt) => {
      const dataField = evt.data.dataTransfer.getData('contact');
      if (!dataField) {
        return;
      }

      evt.data.dataValue =
        '<span class="data-field">' + dataField.name +
        ' ' +
        '</span>';
    });
  }
});
