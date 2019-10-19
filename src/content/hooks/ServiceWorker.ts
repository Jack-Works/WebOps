import { addHook } from '../inject'
import { WebOpsSettingsServiceWorker } from '../../shared/type'

addHook(api => {
    const getRule = api.createGetRule<WebOpsSettingsServiceWorker>('ServiceWorker', {
        managed: true,
        name: 'ServiceWorker',
        value: 'default',
    })
    const origConfirm = confirm
    const origGet = ServiceWorkerContainer.prototype.getRegistrations
    const origContainer = navigator.serviceWorker
    ServiceWorkerContainer.prototype.register = new Proxy(ServiceWorkerContainer.prototype.register, {
        async apply(target, thisArg, args) {
            const rule = getRule()
            if (api.activeForThisSite === false || rule.managed === false || rule.value === 'default')
                return Reflect.apply(target, thisArg, args)
            if (rule.value === 'denied') throw ''
            if (rule.value === 'prompt') {
                const now = await origGet.call(origContainer)
                if (now.length > 0) return Reflect.apply(target, thisArg, args)
                // TODO: remember the falsy choice
                const result = origConfirm.call(window, 'This site want to install a Service Worker. Allow?')
                if (result) return Reflect.apply(target, thisArg, args)
                throw ''
            }
            const obj: ServiceWorkerRegistration = {} as any
            // @ts-ignore
            obj.__proto__ = ServiceWorkerRegistration.prototype
            if (rule.value === 'quite_deny') return obj
        },
    })

    return {
        onPreferenceUpdated(next) {},
    }
})
