const { Switch, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Drawer } = MaterialUI
export function SettingsItemSwitchable(props: {
    name: string
    active: boolean
    icon: string
    secondary?: string
    disabled?: boolean
    onSwitch(boolean: boolean): void
    drawerContent?: React.ReactNode
}) {
    const [opening, setOpen] = React.useState(false)
    return (
        <ListItem
            button={(props.disabled !== true) as any}
            onClick={e =>
                props.drawerContent
                    ? e.target instanceof HTMLInputElement || setOpen(!opening)
                    : props.onSwitch(!props.active)
            }>
            <ListItemIcon>
                <i className="material-icons">{props.icon}</i>
            </ListItemIcon>
            <ListItemText primary={props.name} secondary={props.secondary} />
            <ListItemSecondaryAction>
                <Switch
                    edge="end"
                    checked={props.active}
                    onChange={e => {
                        e.stopPropagation()
                        props.onSwitch(!props.active)
                    }}
                />
            </ListItemSecondaryAction>
            {props.drawerContent === undefined ? (
                undefined
            ) : (
                <Drawer anchor="bottom" open={opening} onClose={() => setOpen(false)}>
                    {props.drawerContent}
                </Drawer>
            )}
        </ListItem>
    )
}
export function SettingsItemEditable<T extends number | string>(props: {
    name: string
    icon: string
    placeholder?: string
    secondary?: string
    disabled?: boolean
    defaultValue: T
    onChange(newValue: T): void
}) {
    const [text, setText] = React.useState(props.defaultValue)
    const origType = React.useRef(typeof text)
    return (
        <ListItem>
            <ListItemIcon>
                <i className="material-icons">{props.icon}</i>
            </ListItemIcon>
            <ListItemText primary={props.name} secondary={props.secondary} />
            <ListItemSecondaryAction>
                <MaterialUI.Input
                    type={origType.current}
                    value={text}
                    onChange={e => setText(e.currentTarget.value as any)}
                    placeholder={props.placeholder}
                    onBlur={() =>
                        props.onChange((origType.current === 'number' ? parseFloat(text as any) : text) as any)
                    }
                />
            </ListItemSecondaryAction>
        </ListItem>
    )
}
