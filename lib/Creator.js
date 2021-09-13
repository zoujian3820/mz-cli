const inquirer = require('inquirer')
const { fetchRepoList, fetchTagList } = require('./request')
const { wrapLoading } = require('./util')
const util = require('util')

// 此第三方包 不支持promise
const downloadGiRepo = require('download-git-repo')

class Creator {
    constructor(projectName, targetDir) {
        // new的时候会调用构造函数
        this.name = projectName
        this.target = targetDir
        // 通过promisify转换 此时这个downloadGiRepo就是一个promise方法
        this.downloadGiRepo = util.promisify(downloadGiRepo)
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
        // console.log(repo)
        return repo
    }
    async fetchTag(repo) {
        let tags = await wrapLoading(fetchTagList, 'waiting fetch tag', repo)
        // console.log(tags, 'tags')
        if (!tags) return
        tags = tags.map(item => item.name)

        let { tag } = await inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tags,
            message: 'please choose a tag to create project'
        })
        // console.log(tag)
        return tag
    }
    async download(repo, tag) {
        // downloadGiRepo
        // 1 需要拼接出 下载的路径
        // zhu-cli/vue-template#1.0
        let requestUrl = `zhu-cli/${repo}${tag ? '#' + tag : ''}`

        // 2 把资源下载到某个路径上(后续可以增加缓存功能, 应该下载到系统目录中，稍后可以使用 ejs handlerbar 去渲染模板 最后生成结果 再写入)
        await this.downloadGiRepo(requestUrl, this.target)
        return this.target
    }
    async create() {

        // 真实开始创建
        // 1、要实现脚手架，先做一个命令行交互的功能 inquirer
        // console.log(this.name, this.target)

        // 2、将模版下载下来
        //    先去拉取远程当前组织下的模版
        let repo = await this.fetchRepo()
        console.log(repo)
        //    再通过模版找到版本号
        let tag = await this.fetchTag(repo)
        // 3、下载
        let downloadUrl = await this.download(repo, tag)

        // 4、编译模板
    }
}

module.exports = Creator