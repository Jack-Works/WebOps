/// <reference path="../../node_modules/web-ext-types/global/index.d.ts" />

import { readSettingsForSite, Events } from '../shared/settings.js'
import { PopupSettingsCard } from './ListPermission.js'

const container = document.createElement('main')

async function main() {
    const [tab] = await browser.tabs.query({ active: true })
    const settings = await readSettingsForSite(tab.url!)
    ReactDOM.render(
        <MaterialUI.MuiThemeProvider
            theme={MaterialUI.createMuiTheme({
                palette: { type: 'dark', primary: MaterialUI.colors.teal, secondary: MaterialUI.colors.cyan },
            })}>
            <PopupSettingsCard origin={new URL(tab.url!).origin} settings={settings} />
        </MaterialUI.MuiThemeProvider>,
        container,
    )
}

const message = new HoloflowsKit.MessageCenter<Events>()
message.on('updated', main)

main()
document.body.appendChild(container)
