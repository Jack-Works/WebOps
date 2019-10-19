import { addHook } from '../inject'
import { WebOpsSettingsNotification } from '../../shared/type'

addHook(api => {
    const getRule = api.createGetRule<WebOpsSettingsNotification>('Notification', {
        managed: false,
        value: 'default',
        name: 'Notification',
    })
    const oldRequestPermission = Notification.requestPermission
    Notification.requestPermission = async () => {
        if (api.activeForThisSite === false) return oldRequestPermission()
        const rule = getRule()
        if (rule.managed && rule.value !== 'default') return rule.value
        else return oldRequestPermission()
    }

    const oldPermission = Object.getOwnPropertyDescriptor(Notification, 'permission')!
    Object.defineProperty(Notification, 'permission', {
        configurable: true,
        enumerable: true,
        get() {
            if (api.activeForThisSite === false) return oldPermission.get!()
            const rule = getRule()
            if (rule.managed) return rule.value
            return oldPermission.get!()
        },
    })

    return {
        onPreferenceUpdated(next) {},
    }
})
