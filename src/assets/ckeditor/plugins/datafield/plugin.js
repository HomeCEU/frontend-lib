CKEDITOR.plugins.add('datafield', {
  requires: 'widget',

  init(editor) {
    editor.widgets.add('datafield', {
      allowedContent: 'span(!data-field); (!p-name);',
      requiredContent: 'span(data-field)',
      pathName: 'datafield',

      upcast: (el) => {
        return el.name === 'span' && el.hasClass('data-field');
      }
    });

    // This feature does not have a button, so it needs to be registered manually.
    editor.addFeature(editor.widgets.registered.datafield);

    // Handle dropping a data field by transforming the data field object into HTML.
    // Note: All pasted and dropped content is handled in one event - editor#paste.
    editor.on('paste', (evt) => {
      const dataField = evt.data.dataTransfer.getData('dataFieldElement');
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
