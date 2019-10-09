import './hooks/Notification'
import './hooks/WebMIDI'
import { loadHooks } from './inject'
import { settingsUpdating } from '../shared/settings'
settingsUpdating.then(loadHooks)
