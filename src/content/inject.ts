import { WebOpsSettingForSite, readSettingsForSite, Events } from '../shared/settings'

export interface WebOpsMainFrameHook {
    onPreferenceUpdated(newPreference: WebOpsSettingForSite): void
}
type HookFunction = (getPreference: () => WebOpsSettingForSite) => WebOpsMainFrameHook
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
        hooks.add(hook(() => preference))
    }
    hook.toString()
    // @ts-ignore
    placeholder4
    document.getElementById('placeholder3')!.remove()
}
const eventID = Math.random() + ''
async function updatePreference() {
    const next = await readSettingsForSite(location.href)
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
const prefPromise = readSettingsForSite(location.href)
export async function loadHooks() {
    const preference = await prefPromise
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
