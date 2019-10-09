import { addHook } from '../inject'

addHook(getPreference => {
    function getRule(pref = getPreference()) {
        return (
            pref.rules.filter(x => x.name === 'MIDI')[0] || {
                managed: true,
                name: 'MIDI',
            }
        )
    }
    // @ts-ignore
    const oldRequestMIDIAccess: () => Promise<any> = Navigator.prototype.requestMIDIAccess
    // @ts-ignore
    Navigator.prototype.requestMIDIAccess = new Proxy(oldRequestMIDIAccess, {
        apply(target, thisArg, args) {
            const pref = getPreference()
            const rule = getRule()
            if (pref.active === false || rule.managed === false) return Reflect.apply(target, thisArg, args)
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
