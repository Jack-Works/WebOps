import { Theme } from '@material-ui/core'
import { ListItemProps } from '@material-ui/core/ListItem'
import { PopupCardWithState } from '../popup/ListPermission.js'
import { useCurrentSettings } from '../shared/settings.js'

const { makeStyles, createStyles, List, ListItem, ListItemIcon, Divider, ListItemText, Grid } = MaterialUI
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
    }),
)

export function RulesList(props: { onEdit(origin: string): void }) {
    const classes = useStyles()
    const settings = useCurrentSettings()

    return (
        <div className={classes.root}>
            <List dense>
                <ListItem disabled button>
                    <ListItemIcon>
                        <i className="material-icons">add</i>
                    </ListItemIcon>
                    <ListItemText primary="Add new rule" />
                </ListItem>
            </List>
            <Divider />
            <List dense>
                {Object.keys(settings.rules).map(origin => (
                    <ListItem button onClick={() => props.onEdit(origin)}>
                        {/* <ListItemIcon>
                            <Checkbox edge="start" checked tabIndex={-1} disableRipple />
                        </ListItemIcon> */}
                        <ListItemText primary={origin} />
                        {/* <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                                <i className="material-icons">delete</i>
                            </IconButton>
                        </ListItemSecondaryAction> */}
                    </ListItem>
                ))}
            </List>
        </div>
    )
}

export default function RulesEditor() {
    const [editing, setEditing] = React.useState<string>('http://example.com/')
    return (
        <Grid container spacing={4}>
            <Grid item xs={5}>
                <RulesList onEdit={setEditing} />
            </Grid>
            <Grid item xs={7}>
                <PopupCardWithState origin={editing} />
            </Grid>
        </Grid>
    )
}
