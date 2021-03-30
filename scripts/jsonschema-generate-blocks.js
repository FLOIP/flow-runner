/**
 * Custom bulk schema generation
 */
const tsj = require('ts-json-schema-generator')
const fs = require('fs')

let path = 'src/model/block/'
let config = {
  path: `../${path}*.ts`, // it fails without `../` prefix
  tsconfig: 'tsconfig.json',
  type: 'ILogBlock',
}

const output_path = 'dist/resources/'

fs.readdir(path, (err, files) => {
  const blockTypes = files.filter(file => file.includes('Block.ts'))
    .map(file => file.replace('.ts', ''))
  blockTypes.forEach(type => {
    console.log('Generating schema for', type)
    config.type = type
    generateSchema(config, `${output_path}${type}.json`)
  })
})

function generateSchema(config, output_file) {
  try {
    const schema = tsj.createGenerator(config).createSchema(config.type)
    const schemaString = JSON.stringify(schema, null, 2)
    fs.writeFile(output_file, schemaString, (err) => {
      if (err) {
        throw err
      }
    })
  } catch (e) {
    console.error('Cannot generate schema for', config, 'to', output_file)
    console.error(e)
    //TODO: fix/find workaround for IAdvancedSelectOneBlock
  }
}


