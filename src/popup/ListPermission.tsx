/// <reference path="./global.d.ts" />

import { WebOpsSettingForSite, modifyRule } from '../shared/settings.js'
import { SettingsItem } from './SettingsItem.js'
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
export function PopupSettingsCard(props: { origin: string; settings: WebOpsSettingForSite }) {
    const notification = props.settings.rules.find(x => x.name === 'Notification') || {
        managed: false,
        name: 'Notification',
        value: 'default',
    }
    props.settings.rules = Array.from(new Set([...props.settings.rules, notification]))
    return (
        <Card>
            <CardContent style={{ marginBottom: 0 }}>
                <Typography component="h5" variant="h5">
                    Permission for {props.origin}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Using template: {props.settings.extends}
                </Typography>
            </CardContent>

            <List subheader={<ListSubheader>Settings</ListSubheader>}>
                <SettingsItem
                    icon="extension"
                    name="Enable WebOps for this site"
                    active={props.settings.active}
                    onSwitch={next => {
                        props.settings.active = next
                        modifyRule(props.origin, props.settings)
                    }}></SettingsItem>
                <SettingsItem
                    onSwitch={next => {
                        notification.managed = next
                        modifyRule(props.origin, props.settings)
                    }}
                    icon="notifications"
                    name="Notifications"
                    active={notification.managed}
                    secondary={'Policy: ' + notification.value}
                    drawerContent={
                        <List dense>
                            <NotificationOptions
                                primary="Default"
                                secondary="Let the browser handle everything"
                                selected={notification.value === 'default'}
                                onClick={() => {
                                    notification.value = 'default'
                                    modifyRule(props.origin, props.settings)
                                }}
                            />
                            <NotificationOptions
                                primary="Grant (mock)"
                                secondary="WebOps will tell the webpage that this permission is granted. (But it's actually not.)"
                                selected={notification.value === 'granted'}
                                onClick={() => {
                                    notification.value = 'granted'
                                    modifyRule(props.origin, props.settings)
                                }}
                            />
                            <NotificationOptions
                                primary="Denied (mock)"
                                secondary="WebOps will tell the webpage that this permission is denied. (But it's actually not.)"
                                selected={notification.value === 'denied'}
                                onClick={() => {
                                    notification.value = 'denied'
                                    modifyRule(props.origin, props.settings)
                                }}
                            />
                        </List>
                    }
                />
            </List>
        </Card>
    )
}
function NotificationOptions(props: { selected: boolean; primary: string; secondary: string; onClick(): void }) {
    return (
        <ListItem selected={props.selected} button onClick={props.onClick}>
            <ListItemText primary={props.primary} secondary={props.secondary} />
        </ListItem>
    )
}
