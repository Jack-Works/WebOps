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
export type MatchingTypes = 'regexp'
export type WebOpsSettingForSite = {
    active: boolean
    /** Should be the name of a template */
    extends?: string
    rules: WebOpsSettings[]
}
export declare type WebOpsTemplate = {
    matches: [MatchingTypes, string][]
    no_matches: [MatchingTypes, string][]
    rules: WebOpsSettings[]
    order: number
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
        result.templates = { default: { matches: [['regexp', '.+']], no_matches: [], rules: [], order: -Infinity } }
    return result
}
let currentSetting: WebOpsSettingsStore
export async function writeSettings(settings = currentSetting) {
    return browser.storage.sync.set(settings as any)
}
const ready = readSettings().then(x => (currentSetting = x))
export async function readSettingsForSite(url: string): Promise<WebOpsSettingForSite> {
    await ready
    for (const matchingRule in currentSetting.rules) {
        if (matchingRule === new URL(url).origin) {
            const rule = Object.assign({}, currentSetting.rules[matchingRule])
            const template = currentSetting.templates[rule.extends || 'default'] || {}
            rule.rules = Object.assign({}, template.rules || {}, rule.rules)
            return rule
        }
    }
    // TODO: sort by order
    for (const template in currentSetting.templates) {
        const { matches, no_matches, rules } = currentSetting.templates[template]
        if (
            matches.some(([type, rule]) => url.match(new RegExp(rule))) &&
            no_matches.some(([type, rule]) => url.match(new RegExp(rule))) === false
        ) {
            return { active: true, rules }
        }
    }
    return { active: false, rules: [] }
}
export async function modifyRule(url: string, newRule: WebOpsSettingForSite) {
    const origin = new URL(url).origin
    currentSetting.rules[origin] = newRule
    return writeSettings()
}
