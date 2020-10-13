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
  console.info('Frontend-lib Elements created successfully!')

})()

