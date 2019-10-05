import { Theme } from '@material-ui/core'
import { useCurrentSettings, useTemplate } from '../shared/settings.js'
import { GeneralPermissionEditor } from '../popup/GeneralPermissionEditor.js'

const { makeStyles, createStyles, List, ListItem, ListItemIcon, Divider, ListItemText, Grid } = MaterialUI
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
    }),
)

export function TemplateList(props: { onEdit(origin: string): void }) {
    const classes = useStyles()
    const settings = useCurrentSettings()

    return (
        <div className={classes.root}>
            <List dense>
                <ListItem disabled button>
                    <ListItemIcon>
                        <i className="material-icons">add</i>
                    </ListItemIcon>
                    <ListItemText primary="Create new template" />
                </ListItem>
            </List>
            <Divider />
            <List dense>
                {Object.keys(settings.templates).map(template => (
                    <ListItem button onClick={() => props.onEdit(template)}>
                        {/* <ListItemIcon>
                            <Checkbox edge="start" checked tabIndex={-1} disableRipple />
                        </ListItemIcon> */}
                        <ListItemText primary={template} />
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

export default function TemplateEditor() {
    const [editing, setEditing] = React.useState<string>('default')
    const template = useTemplate(editing)
    return (
        <Grid container spacing={4}>
            <Grid item xs={5}>
                <TemplateList onEdit={setEditing} />
            </Grid>
            <Grid item xs={7}>
                <GeneralPermissionEditor type="template" settings={template} template={editing} />
            </Grid>
        </Grid>
    )
}
