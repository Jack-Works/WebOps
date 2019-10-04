const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '../')
const src = path.join(root, './src')
const assets = path.join(root, './assets')
const build = path.join(root, './build')
const dependencies = path.join(build, './dependencies')

if (!fs.existsSync(build)) fs.mkdirSync(build)
if (!fs.existsSync(dependencies)) fs.mkdirSync(dependencies)

const dependenciesMap = new Map([
    [require.resolve('webextension-polyfill'), 'browser-polyfill.js'],
    [require.resolve('react/umd/react.production.min.js'), 'react.js'],
    [require.resolve('react-dom/umd/react-dom.production.min'), 'react-dom.js'],
    [require.resolve('@material-ui/core/umd/material-ui.production.min.js'), 'material-ui.js'],
    [require.resolve('@holoflows/kit/umd/index.js'), 'kit.js'],
])
for (const [src, dist] of dependenciesMap.entries()) {
    fs.copyFileSync(src, path.join(dependencies, dist))
}
fs.copyFileSync(
    path.join(__dirname, '../node_modules/async-call-rpc/src/Async-Call.ts'),
    path.join(__dirname, '../src/shared/async-call.ts'),
)

for (const file of fs.readdirSync(assets)) {
    const filePath = path.join(assets, file)
    if (fs.lstatSync(filePath).isFile()) {
        fs.copyFileSync(filePath, path.join(build, file))
    }
}
