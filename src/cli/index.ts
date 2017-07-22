#!/usr/bin/env node
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
  .arguments('<job-script-path>')
  .option('-p, --param <key>=<value>', 'Add parameter', objectCollector, {})
  .option('-e, --env <key>=<value>', 'Add environment variable', arrayCollector, [])
  .action(script => {
    const params = program.param
    const env = program.env
    run(process.argv[2], { params, env })
  })
  .parse(process.argv)
