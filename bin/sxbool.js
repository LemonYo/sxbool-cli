#!/usr/bin/env node

'use strict'

const program = require('commander')
const chalk = require('chalk')
 
program
  .version(require('../package').version)
  .usage('<command> [options]')

program
.usage('<command>')


program
  .command('init <template-name> <app-name>')
  .description('create a new project powered by <template-name>')
  .action((template, name) => {
    require('../lib/create.js')(template, name)
  })

program
  .command('list')
  .description('choose a template into your progect')
  .action(() => {
    const list = require('../lib/template.json').list
    console.log(' ')
    console.log('------------- 可用模板列表：------------')
    list.map(item => {
      console.log(' ')
      console.log(
        '  ' + chalk.green('★') +
        '  ' + chalk.green(item.name) +
        '           ' + chalk.yellow(item.desc))
    })
    console.log(' ')
  })

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
