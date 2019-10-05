import './hooks/Notification'
import { loadHooks } from './inject'
import { settingsUpdating } from '../shared/settings'
settingsUpdating.then(loadHooks)
