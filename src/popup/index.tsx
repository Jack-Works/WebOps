/// <reference path="../../node_modules/web-ext-types/global/index.d.ts" />

import { PopupCardWithState } from './ListPermission.js'
import { settingsUpdating } from '../shared/settings.js'
const container = document.createElement('main')

async function main() {
    await settingsUpdating
    const [tab] = await browser.tabs.query({ active: true })
    ReactDOM.render(<PopupCardWithState origin={new URL(tab.url!).origin}></PopupCardWithState>, container)
}
main()
document.body.appendChild(container)
