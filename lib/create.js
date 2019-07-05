const co = require('co')
const prompt = require('co-prompt')
const chalk = require('chalk')
const fs = require('fs')
const ora = require('ora');
const download = require('download-git-repo')
const utils = require('./utils')
const tempList = require('../lib/template.json').list
// const templateObj = {}

module.exports = (template, name) => {
  co(function *() {
    const projectName = name || template
    const templateObj = getTempGitRepo(template)
    if (templateObj) {
      downloadTemplatesFromGitRepo(templateObj, projectName)
    } else {
      console.log(chalk.red('\n × 没有找到指定模板!'))
      process.exit()
    }
  })
}

// 获取对应的模板信息
function getTempGitRepo(template) {
  for (let i = 0; i < tempList.length; i++) {
    if (tempList[i].name === template) {
      return tempList[i]
    }
  }
  return null  
}

// 从git上拉取代码

function downloadTemplatesFromGitRepo(temp, name) {
  const spanner = ora("   正在构建，請稍等......");
  spanner.start()
  if (fs.existsSync(name)) {
    utils.delDir(name)
  }
  const gitUrl = `${temp.url}#${temp.branch || 'master'}`
  const path = process.cwd() + "/" + name
  // const path = "/" + name
  console.log(gitUrl, path)
  if (temp.url) {
    download(gitUrl, path, {clone: true}, function(err) {
      if (err) {
        spanner.stop()
        console.log('    ', '----------------------------------------')
        console.log('    ', chalk('构建失败'), err)
        process.exit()
      }
      // 输出构建过程
      console.log('    ','----------------------------------------')
      console.log('    ',chalk.green('★'),chalk.green('项目构建成功'))
      spanner.stop()
      process.exit()
    })
  } else {
    console.log('    ', chalk('构建失败, 无法获取当前模板的仓库地址'))
    spanner.stop()
    process.exit()
  }
}

