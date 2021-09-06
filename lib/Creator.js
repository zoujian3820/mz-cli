const inquirer = require('inquirer')
const { fetchRepoList } = require('./request')
const ora = require('ora')

async function sleep(n) {
    return Promise((resolve) => {
        setTimeout(resolve, n)
    })
}

async function wrapLoading(fn, message) {
    const spinner = ora(message)
    // 开启加载
    spinner.start()
    try {
        let repos = await fn()
        // 成功
        spinner.succeed()
        return repos
    } catch (error) {
        spinner.fail('request failed, refetch...')
        await sleep(1000)
        return wrapLoading(fn, message)
    }

}

class Creator {
    constructor(projectName, targetDir) {
        // new的时候会调用构造函数
        this.name = projectName
        this.target = targetDir
    }
    async fetchRepo() {
        // 失败重新拉取
        let repos = await wrapLoading(fetchRepoList, 'waiting fetch tamplate')
        // console.log(repos)
        if (!repos) return
        repos = repos.map(item => item.name)
        let { repo } = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: 'please choose a template to create project'
        })
        console.log(repo)
    }
    async fetchTag() { }
    async download() { }
    async create() {

        // 真实开始创建
        // 1、要实现脚手架，先做一个命令行交互的功能 inquirer
        // console.log(this.name, this.target)

        // 2、将模版下载下来
        //    先去拉取远程当前组织下的模版
        let repo = await this.fetchRepo()
        //    再通过模版找到版本号
        let tag = await this.fetchTag()
        //    下载
        let downloadUrl = await this.download(repo, tag)

        // 单独去写个类，去生成模板
        // 3、根据用户的选择动态的生成内容 metalsmith
    }
}

module.exports = Creator