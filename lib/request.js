// 通过axios来获取结果
// npm i axios
const axios = require('axios')
// https://api.github.com/orgs/zhu-cli/repos

// 配个拦截器
axios.interceptors.response.use(res => res.data)

async function fetchRepoList() {
    // 可以通过配置文件 拉取不同的仓库对应的用户下的文件
    return axios.get('https://api.github.com/orgs/zhu-cli/repos')
}

async function fetchTagList(repo) {
    return axios.get(`https://api.github.com/repos/zhu-cli/${repo}/tags`)
}

module.exports = {
    fetchRepoList,
    fetchTagList
}