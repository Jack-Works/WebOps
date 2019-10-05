import {
    WebOpsSettingForSite,
    WebOpsTemplate,
    modifyOriginRule,
    InheritFromTemplate,
    modifyTemplateRule,
} from '../shared/settings.js'
import { SettingsItemSwitchable, SettingsItemEditable } from './SettingsItem.js'
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
interface TemplateProps {
    type: 'template'
    template: string | null
    settings: WebOpsTemplate
}
interface OriginProps {
    type: 'origin'
    origin: string | null
    settings: WebOpsSettingForSite
}
type Props = OriginProps | TemplateProps
export function GeneralPermissionEditor(props: Props) {
    const notification = getNotificationRule(props.settings)
    const [editingTitle, setTitle] = React.useState('')

    const input = (
        <>
            <MaterialUI.Input
                value={editingTitle}
                onChange={e => setTitle(e.currentTarget.value)}
                placeholder={props.type === 'origin' ? 'https://example.com' : 'template name'}
            />
            <MaterialUI.Button
                onClick={() =>
                    saveSettings({
                        ...props,
                        ...(props.type === 'origin' ? { origin: editingTitle } : { template: editingTitle }),
                    })
                }
                color="primary">
                Save
            </MaterialUI.Button>
        </>
    )

    const title =
        props.type === 'origin' ? <>Permission for {props.origin || input}</> : <>Template: {props.template || input}</>
    const subTitle =
        props.type === 'origin' ? `Using template: ${props.settings.extends}` : `Priority: ${props.settings.priority}`

    const originOnlyActiveSetting = props.type === 'origin' && (
        <SettingsItemSwitchable
            icon="extension"
            name="Enable WebOps for this site"
            active={props.settings.active}
            onSwitch={next => {
                props.settings.active = next
                if (props.origin) modifyOriginRule(props.origin, props.settings)
            }}></SettingsItemSwitchable>
    )
    const templateOnlySettings = props.type === 'template' && (
        <List subheader={<ListSubheader>Template settings</ListSubheader>}>
            <SettingsItemEditable
                icon="priority_high"
                defaultValue={props.settings.priority}
                name="Priority"
                onChange={e => {
                    props.settings.priority = e
                    saveSettings(props)
                }}
            />
        </List>
    )

    return (
        <Card>
            <CardContent style={{ marginBottom: 0 }}>
                <Typography component="h5" variant="h5">
                    {title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {subTitle}
                </Typography>
            </CardContent>
            {templateOnlySettings}
            <List subheader={<ListSubheader>Settings</ListSubheader>}>
                {originOnlyActiveSetting}
                <SettingsItemSwitchable
                    onSwitch={next => {
                        notification.managed = next
                        saveSettings(props)
                    }}
                    icon="notifications"
                    name="Notifications"
                    active={notification.managed}
                    secondary={
                        'Policy: ' +
                        notification.value +
                        ((notification as any)[InheritFromTemplate] ? ' (inherit from template)' : '')
                    }
                    drawerContent={
                        <List dense>
                            <SelectOptions
                                primary="Default"
                                secondary="Let the browser handle everything"
                                selected={notification.value === 'default'}
                                onClick={() => {
                                    notification.value = 'default'
                                    saveSettings(props)
                                }}
                            />
                            <SelectOptions
                                primary="Grant (mock)"
                                secondary="WebOps will tell the webpage that this permission is granted. (But it's actually not.)"
                                selected={notification.value === 'granted'}
                                onClick={() => {
                                    notification.value = 'granted'
                                    saveSettings(props)
                                }}
                            />
                            <SelectOptions
                                primary="Denied (mock)"
                                secondary="WebOps will tell the webpage that this permission is denied. (But it's actually not.)"
                                selected={notification.value === 'denied'}
                                onClick={() => {
                                    notification.value = 'denied'
                                    saveSettings(props)
                                }}
                            />
                        </List>
                    }
                />
            </List>
        </Card>
    )
}

function saveSettings(props: Props) {
    if (props.type === 'origin') {
        if (props.origin) modifyOriginRule(props.origin, props.settings)
    } else {
        if (props.template) modifyTemplateRule(props.template, props.settings)
    }
}

function getNotificationRule(settings: WebOpsTemplate | WebOpsSettingForSite) {
    const notification = settings.rules.find(x => x.name === 'Notification') || {
        managed: true,
        name: 'Notification',
        value: 'default',
        [InheritFromTemplate]: true,
    }
    settings.rules = settings.rules.filter(x => x.name !== notification.name).concat(notification)
    return notification
}

function SelectOptions(props: { selected: boolean; primary: string; secondary: string; onClick(): void }) {
    return (
        <ListItem selected={props.selected} button onClick={props.onClick}>
            <ListItemText primary={props.primary} secondary={props.secondary} />
        </ListItem>
    )
}
