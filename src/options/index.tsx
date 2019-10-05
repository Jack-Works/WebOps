/// <reference path="../../node_modules/web-ext-types/global/index.d.ts" />

import { Events } from '../shared/settings.js'
import Drawer from './Drawer.js'

const container = document.createElement('main')

async function main() {
    ReactDOM.render(
        <MaterialUI.MuiThemeProvider
            theme={MaterialUI.createMuiTheme({
                palette: { type: 'dark', primary: MaterialUI.colors.teal, secondary: MaterialUI.colors.cyan },
            })}>
            <Drawer />
        </MaterialUI.MuiThemeProvider>,
        container,
    )
}

const message = new HoloflowsKit.MessageCenter<Events>()
message.on('updated', main)

main()
document.body.appendChild(container)
