import {
    WebOpsSettingForSite,
    WebOpsTemplate,
    modifyOriginRule,
    InheritFromTemplate,
    modifyTemplateRule,
    WebOpsRules,
    WebOpsSettings,
} from '../shared/settings.js'
import { SettingsItemSwitchable, SettingsItemEditable } from './SettingsItem.js'
import { WebOpsSettingsNotification, WebOpsSettingsMIDI, WebOpsSettingsServiceWorker } from '../shared/type.js'
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
    //#region Notification
    const notificationJSX = useSettingsUI<WebOpsSettingsNotification>(
        props,
        'Notification',
        {
            managed: true,
            name: 'Notification',
            value: 'default',
        },
        {
            icon: 'notifications',
            name: 'Notification',
            secondary: x => 'Policy: ' + x.value,
            options: [
                {
                    primary: 'Default',
                    secondary: 'Let the browser handle everything',
                    isActive: x => x.value === 'default',
                    onActive: s => (s.value = 'default'),
                },
                {
                    primary: 'Grant (mock)',
                    secondary: `WebOps will tell the webpage that this permission is granted. (But it's actually not.)`,
                    isActive: x => x.value === 'granted',
                    onActive: x => (x.value = 'granted'),
                },
                {
                    primary: 'Denied (mock)',
                    secondary: `WebOps will tell the webpage that this permission is denied. (But it's actually not.)`,
                    isActive: x => x.value === 'denied',
                    onActive: x => (x.value = 'denied'),
                },
            ],
        },
    )
    //#endregion
    //#region MIDI
    const midiJSX = useSettingsUI<WebOpsSettingsMIDI>(
        props,
        'MIDI',
        {
            managed: true,
            name: 'MIDI',
        },
        {
            icon: 'music_note',
            name: 'Web MIDI API',
            secondary: () => 'Mock an empty result',
        },
    )
    //#endregion
    //#region ServiceWorker
    const serviceWorkerJSX = useSettingsUI<WebOpsSettingsServiceWorker>(
        props,
        'ServiceWorker',
        {
            managed: false,
            name: 'ServiceWorker',
            value: 'default',
        },
        {
            icon: 'network_check',
            name: 'Service Worker',
            secondary: x => `Policy ${x.value}`,
            options: [
                {
                    primary: 'Default',
                    secondary: 'Let the browser handle everything',
                    isActive: x => x.value === 'default',
                    onActive: s => (s.value = 'default'),
                },
                {
                    primary: 'Denied',
                    secondary: `WebOps will reject the register of the Service Worker`,
                    isActive: x => x.value === 'denied',
                    onActive: x => (x.value = 'denied'),
                },
                {
                    primary: 'Quite deny',
                    secondary: `WebOps will reject the register quitely`,
                    isActive: x => x.value === 'quite_deny',
                    onActive: x => (x.value = 'quite_deny'),
                },
                {
                    primary: 'Prompt',
                    secondary: `WebOps will ask you if there is no Service Worker installed before`,
                    isActive: x => x.value === 'prompt',
                    onActive: x => (x.value = 'prompt'),
                },
            ],
        },
    )
    //#endregion
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
                {notificationJSX}
                {midiJSX}
                {serviceWorkerJSX}
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

interface UI<T> {
    icon: string
    name: string
    secondary?: (settings: T) => string
    options?: {
        primary: string
        secondary: string
        isActive(settings: T): boolean
        onActive(settings: T): void
    }[]
}

function useSettingsUI<T extends WebOpsSettings>(props: Props, name: WebOpsRules, defaultValue: T, ui: UI<T>) {
    const settings = props.settings
    const rule: T = (settings.rules.find(x => x.name === name) || {
        ...defaultValue,
        [InheritFromTemplate]: true,
    }) as any
    settings.rules = settings.rules.filter(x => x.name !== rule.name).concat(rule)

    const jsx = useSwitchableSetting(props, rule, ui)
    return jsx
}

function useSwitchableSetting<T extends WebOpsSettings>(props: Props, settings: T, ui: UI<T>) {
    const inheritFromTemplateNote = (settings as any)[InheritFromTemplate] ? ' (inherit from template)' : ''
    const drawerContent = ui.options ? (
        <List dense>
            {ui.options.map(x => (
                <SelectOptions
                    primary={x.primary}
                    secondary={x.secondary}
                    selected={x.isActive(settings)}
                    onClick={() => {
                        x.onActive(settings)
                        saveSettings(props)
                    }}
                />
            ))}
        </List>
    ) : null
    return (
        <SettingsItemSwitchable
            onSwitch={next => {
                settings.managed = next
                saveSettings(props)
            }}
            icon={ui.icon}
            name={ui.name}
            active={settings.managed}
            secondary={(ui.secondary || (() => ''))(settings) + inheritFromTemplateNote}
            drawerContent={drawerContent}
        />
    )
}

function SelectOptions(props: { selected: boolean; primary: string; secondary: string; onClick(): void }) {
    return (
        <ListItem selected={props.selected} button onClick={props.onClick}>
            <ListItemText primary={props.primary} secondary={props.secondary} />
        </ListItem>
    )
}
