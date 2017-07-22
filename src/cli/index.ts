#!/usr/bin/env node
const packageJson = require('../../package.json')
import program = require('commander')
import run from '../runner'

function objectCollector(expression, acc) {
  const pattern = /^\s*([^\s=]+)=([^\s=]+)\s*$/
  const [ _, key, value ] = pattern.exec(expression)
  acc[key] = value
  return acc
}

function arrayCollector(expression, acc) {
  acc.push(expression)
  return acc
}

program
  .version(packageJson.version)
  .arguments('<job-script-path>')
  .option('-p, --param <key>=<value>', 'Add parameter', objectCollector, {})
  .option(
    '-e, --env <key>=<value>',
    'Add environment variable',
    arrayCollector,
    []
  )
  .action(script => {
    const params = program.param
    const env = program.env
    run(script, { params, env })
  })
  .parse(process.argv)
