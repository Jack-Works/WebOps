const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '../')
const src = path.join(root, './src')
const assets = path.join(root, './assets')
const build = path.join(root, './build')
const dependencies = path.join(build, './dependencies')

if (!fs.existsSync(build)) fs.mkdirSync(build)
if (!fs.existsSync(dependencies)) fs.mkdirSync(dependencies)

const dependenciesMap = new Map([[require.resolve('webextension-polyfill'), 'browser-polyfill.js']])
for (const [src, dist] of dependenciesMap.entries()) {
    fs.copyFileSync(src, path.join(dependencies, dist))
}

for (const file of fs.readdirSync(assets)) {
    const filePath = path.join(assets, file)
    if (fs.lstatSync(filePath).isFile()) {
        fs.copyFileSync(filePath, path.join(build, file))
    }
}
