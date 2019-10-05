import { Theme } from '@material-ui/core'

const {
    makeStyles,
    createStyles,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    Divider,
    ListItemText,
} = MaterialUI
const drawerWidth = 240

import RulesEditor from './RulesEditor.js'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
        },
    }),
)

export default function PermanentDrawerLeft() {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Web Ops
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left">
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    <ListItem button>
                        <ListItemIcon>
                            <i className="material-icons">playlist_add</i>
                        </ListItemIcon>
                        <ListItemText primary="Rules" />
                    </ListItem>
                    <ListItem button disabled>
                        <ListItemIcon>
                            <i className="material-icons">description</i>
                        </ListItemIcon>
                        <ListItemText primary="Template" />
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <RulesEditor></RulesEditor>
            </main>
        </div>
    )
}
