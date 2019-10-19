import {
    WebOpsSettingForSite,
    readSettingsForSite,
    Events,
    settingsUpdating,
    WebOpsRules,
    WebOpsSettings,
} from '../shared/settings'

export interface WebOpsMainFrameHook {
    onPreferenceUpdated(newPreference: WebOpsSettingForSite): void
}
type HookFunction = (apis: {
    createGetRule: <T extends WebOpsSettings>(name: WebOpsRules, defaultValue: T) => (pref?: WebOpsSettingForSite) => T
    activeForThisSite: boolean
    preference: WebOpsSettingForSite
}) => WebOpsMainFrameHook
function codeInMainFrame() {
    const hooks = new Set<WebOpsMainFrameHook>()
    let preference = ('placeholder1' as unknown) as WebOpsSettingForSite
    // update preference
    document.addEventListener('placeholder2', event => {
        const e = event as CustomEvent<WebOpsSettingForSite>
        preference = e.detail
        hooks.forEach(x => x.onPreferenceUpdated(e.detail))
    })
    const hook = function(hook: HookFunction) {
        hooks.add(
            hook({
                createGetRule: (ruleName, defaultRule) => (p = preference) =>
                    ((p.rules.filter(x => x.name === ruleName)[0] || defaultRule) as WebOpsSettings) as any,
                get activeForThisSite() {
                    return preference.active
                },
                get preference() {
                    return preference
                },
            }),
        )
    }
    hook.toString()
    // @ts-ignore
    placeholder4
    document.getElementById('placeholder3')!.remove()
}
const eventID = Math.random() + ''
async function updatePreference() {
    await settingsUpdating
    const next = readSettingsForSite(location.href)
    document.dispatchEvent(
        new CustomEvent(eventID, {
            detail: next,
        }),
    )
}
const messageCenter = new HoloflowsKit.MessageCenter<Events>()
messageCenter.on('updated', updatePreference)
const loadedHooks: HookFunction[] = []
export function addHook(f: HookFunction) {
    loadedHooks.push(f)
}
export async function loadHooks() {
    const preference = readSettingsForSite(location.href)
    const hooksHTML = loadedHooks.map(f => `hook(${f.toString()});`).join('\n')

    const script = document.createElement('script')
    script.id = Math.random() + ''
    script.innerHTML =
        ';(' +
        codeInMainFrame
            .toString()
            .replace("'placeholder1'", JSON.stringify(preference))
            .replace('placeholder2', eventID)
            .replace('placeholder3', script.id)
            .replace('placeholder4', hooksHTML) +
        ')();'
    document.children[0].appendChild(script)
}
