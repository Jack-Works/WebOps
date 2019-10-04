const { Switch, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Drawer } = MaterialUI
export function SettingsItem(props: {
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
            button={(props.drawerContent !== undefined && props.disabled !== true) as any}
            onClick={e => e.target instanceof HTMLInputElement || setOpen(!opening)}>
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
