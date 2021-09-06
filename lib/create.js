const path = require('path')

// const util = require('util');
// const fs = require('fs');

// const stat = util.promisify(fs.stat);

// const fs = require('fs')
// npm i fs-extra  替代原生的fs 原生的文件系统模块很多都不支持promise

const fs = require('fs-extra')

// npm i inquirer 能提供支持 用户选择的插件
const Inquirer = require('inquirer')
const Creator = require('./Creator')

module.exports = async function (projectName, opt) {
    // 创建项目

    // 获取当前命令执行时的工作目录
    // D:\study-project\demo
    const cwd = process.cwd()

    // 目标目录
    // D:\study-project\demo\xxname
    const targetDir = path.join(cwd, projectName)
    // console.log(projectName, opt, cwd)
    // console.log(targetDir)
    // 判断当前目前是否存在
    if (fs.existsSync(targetDir)) {
        // 目录存在，并且传了强制替换的参数 -f或--force
        if (opt.force) {
            // 则先删除这个原先存在的同名目录
            await fs.remove(targetDir)
        } else {
            // 提示用户是否要覆盖
            let { action } = await Inquirer.prompt([
                // 配置询问的方式
                {
                    name: 'action',
                    type: 'list', // 类型丰富
                    message: 'target directory already exists Pick an action:',
                    choices: [
                        { name: 'Overwrite', value: 'overwrite' },
                        { name: 'Cancel', value: false }
                    ]
                }
            ])
            console.log(action)
            if (!action) {
                return
            } else if (action === 'overwrite') {
                console.log(`\r\nRemoving...`)
                await fs.remove(targetDir)
                console.log(`删除成功`)
            }
        }
    }
    // 创建项目
    const creator = new Creator(projectName, targetDir)
    // 开始创建
    creator.create()
}