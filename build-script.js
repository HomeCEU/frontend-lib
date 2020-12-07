const fs = require('fs-extra');
const concat = require('concat');

(async function build() {

  const files =[
    './dist/frontend-lib/runtime.js',
    './dist/frontend-lib/polyfills.js',
    './dist/frontend-lib/main.js'
  ]

  await fs.ensureDir('elements')
  await concat(files, 'elements/frontend-lib.js')
  await fs.copyFile('./dist/frontend-lib/styles.css', 'elements/styles.css')
  await fs.copyFile('./dist/frontend-lib/data-table.woff', 'elements/data-table.woff')
  console.info('Frontend-lib Elements created successfully!')

})()
