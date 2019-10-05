/// <reference path="./global.d.ts" />

import { WebOpsSettingForSite, modifyOriginRule, useCurrentSettingsForOrigin } from '../shared/settings.js'
import { SettingsItemSwitchable } from './SettingsItem.js'
import { GeneralPermissionEditor } from './GeneralPermissionEditor.js'
const {
    Card,
    CardContent,
    Typography,
    List,
    ListSubheader,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} = MaterialUI

export function PopupCardWithState(props: { origin: string }) {
    const settings = useCurrentSettingsForOrigin(props.origin)
    return (
        <MaterialUI.MuiThemeProvider
            theme={MaterialUI.createMuiTheme({
                palette: { type: 'dark', primary: MaterialUI.colors.teal, secondary: MaterialUI.colors.cyan },
            })}>
            <GeneralPermissionEditor type="origin" origin={props.origin} settings={settings} />
        </MaterialUI.MuiThemeProvider>
    )
}
