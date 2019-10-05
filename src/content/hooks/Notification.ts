import { addHook } from '../inject'

addHook(getPref => {
    function getRule(pref = getPref()) {
        return (
            pref.rules.filter(x => x.name === 'Notification')[0] || {
                managed: false,
                value: 'default',
                name: 'Notification',
            }
        )
    }
    const oldRequestPermission = Notification.requestPermission
    Notification.requestPermission = async () => {
        const pref = getPref()
        if (pref.active === false) return oldRequestPermission()
        const rule = getRule()
        if (rule.managed && rule.value !== 'default') return rule.value
        else return oldRequestPermission()
    }

    const oldPermission = Object.getOwnPropertyDescriptor(Notification, 'permission')!
    Object.defineProperty(Notification, 'permission', {
        configurable: true,
        enumerable: true,
        get() {
            const pref = getPref()
            if (pref.active === false) return oldPermission.get!()
            const rule = getRule()
            if (rule.managed) return rule.value
            return oldPermission.get!()
        },
    })

    return {
        onPreferenceUpdated(next) {},
    }
})
