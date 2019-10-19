import './hooks/Notification'
import './hooks/WebMIDI'
import './hooks/ServiceWorker'
import { loadHooks } from './inject'
import { settingsUpdating } from '../shared/settings'
settingsUpdating.then(loadHooks)
