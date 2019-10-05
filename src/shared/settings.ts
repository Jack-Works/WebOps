/// <reference path="./global.d.ts" />

import { WebOpsSettingsNotification } from './types/Notification'
export type WebOpsRules = 'Notification'
export type WebOpsSettings = WebOpsSettingsNotification
export interface WebOpsBaseSetting {
    name: WebOpsRules
    /**
     * Is this permission managed by WebOps?
     */
    managed: boolean
}
export type WebOpsSettingForSite = {
    active: boolean
    /** Should be the name of a template */
    extends: string
    rules: WebOpsSettings[]
}
export type MatchingTypes = 'regexp'
export type WebOpsTemplate = {
    matches: [MatchingTypes, string][]
    no_matches: [MatchingTypes, string][]
    rules: WebOpsSettings[]
    priority: number
}
export interface WebOpsSettingsStore {
    /**
     * Templates can let user choose default behavior for websites.
     */
    templates: {
        [templateName: string]: WebOpsTemplate
        default: WebOpsTemplate
    }
    /**
     * Manually edited rules by user.
     */
    rules: {
        [matchingRule: string]: WebOpsSettingForSite
    }
}
export async function readSettings(): Promise<WebOpsSettingsStore> {
    const result = (((await browser.storage.sync.get()) as any) as WebOpsSettingsStore) || {}
    if (!result.rules) result.rules = {}
    if (!result.templates)
        result.templates = { default: { matches: [['regexp', '.+']], no_matches: [], rules: [], priority: -Infinity } }
    return result
}
export const currentSettingRef = new HoloflowsKit.ValueRef<WebOpsSettingsStore>(null as any)
export function useCurrentSettings() {
    const [x, y] = (window as any).React.useState(currentSettingRef.value)
    ;(window as any).React.useEffect(() => currentSettingRef.addListener(q => y(q)))
    return x as WebOpsSettingsStore
}
export function useCurrentSettingsForOrigin(url: string) {
    const settings = useCurrentSettings()
    return readSettingsForSite(url, settings)
}
export interface Events {
    updated: void
}
const messageCenter = new HoloflowsKit.MessageCenter<Events>()
export let settingsUpdating: Promise<WebOpsSettingsStore>
function updateSetting(): Promise<WebOpsSettingsStore> {
    settingsUpdating = readSettings().then(x => (currentSettingRef.value = x))
    return settingsUpdating
}
updateSetting()
messageCenter.on('updated', updateSetting)
async function writeSettings(settings = currentSettingRef.value) {
    await browser.storage.sync.set(settings as any)
    messageCenter.emit('updated', undefined, true)
}
export function readSettingsForSite(url: string, settings = currentSettingRef.value): WebOpsSettingForSite {
    for (const matchingRule in settings.rules) {
        if (matchingRule === new URL(url).origin) {
            const rule = Object.assign({}, settings.rules[matchingRule])
            const template = settings.templates[rule.extends || 'default'] || {}
            rule.rules = [...template.rules, ...rule.rules]
            return rule
        }
    }
    // TODO: sort by order
    for (const template in settings.templates) {
        const { matches, no_matches, rules } = settings.templates[template]
        if (
            matches.some(([type, rule]) => url.match(new RegExp(rule))) &&
            no_matches.some(([type, rule]) => url.match(new RegExp(rule))) === false
        ) {
            return { active: true, rules, extends: template }
        }
    }
    return { active: false, rules: [], extends: 'default' }
}
export async function modifyRule(url: string, newRule: WebOpsSettingForSite) {
    const origin = new URL(url).origin
    currentSettingRef.value.rules[origin] = newRule
    return writeSettings()
}
