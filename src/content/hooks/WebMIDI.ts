import { addHook } from '../inject'
import { WebOpsSettingsMIDI } from '../../shared/type'

addHook(api => {
    const getRule = api.createGetRule<WebOpsSettingsMIDI>('MIDI', {
        managed: true,
        name: 'MIDI',
    })
    // @ts-ignore
    const oldRequestMIDIAccess: () => Promise<any> = Navigator.prototype.requestMIDIAccess
    // @ts-ignore
    Navigator.prototype.requestMIDIAccess = new Proxy(oldRequestMIDIAccess, {
        apply(target, thisArg, args) {
            const rule = getRule()
            if (api.activeForThisSite === false || rule.managed === false) return Reflect.apply(target, thisArg, args)
            const fakeObject = {
                sysexEnabled: false,
                inputs: { size: 0 },
                outputs: { size: 0 },
                onstatechange: null,
            }
            // @ts-ignore
            fakeObject.__proto__ = MIDIAccess.prototype
            // @ts-ignore
            fakeObject.inputs.__proto__ = MIDIInputMap.prototype
            // @ts-ignore
            fakeObject.outputs.__proto__ = MIDIOutputMap.prototype
            return Promise.resolve(fakeObject)
        },
    })

    return {
        onPreferenceUpdated(next) {},
    }
})
