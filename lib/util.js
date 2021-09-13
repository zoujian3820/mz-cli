const ora = require('ora')

async function sleep(n) {
    return new Promise((resolve) => {
        setTimeout(resolve, n)
    })
}

// 制作一个等待的loading
async function wrapLoading(fn, message, ...args) {
    const spinner = ora(message)
    // 开启加载
    spinner.start()
    try {
        let repos = await fn(...args)
        // 成功
        spinner.succeed()
        return repos
    } catch (error) {
        spinner.fail('request failed, refetch...')
        await sleep(1000)
        return wrapLoading(fn, message, ...args)
    }

}

module.exports = {
    sleep,
    wrapLoading
}