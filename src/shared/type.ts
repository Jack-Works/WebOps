import { WebOpsBaseSetting } from './settings.js'
export interface WebOpsSettingsMIDI extends WebOpsBaseSetting {
    name: 'MIDI'
}
export interface WebOpsSettingsNotification extends WebOpsBaseSetting {
    /**
     * The value that user set this permission to
     */
    value: NotificationPermission
    name: 'Notification'
}
