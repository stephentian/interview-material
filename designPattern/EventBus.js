/**
 * author: stephentian
 * email: tianre96@gmail.com
 * day: 2023-07-19
 **/

class EventBus {
    constructor() {
        this.subscribes = {}
    }

    // 订阅事件
    subscribe(event, callback) {
        if (!this.subscribes[event]) {
            this.subscribes[event] = []
        }
        this.subscribes[event].push(callback)
    }

    // 发布事件
    publish(event, data) {
        if (!this.subscribes[event] || !this.subscribes[event].length) throw Error('No subscription event')

        this.subscribes[event].forEach(callback => {
            callback(data)
        });
    }

    // 取消订阅
    unsubcribe(event, callback) {
        if (!this.subscribes[event]) throw Error('No subscription event')

        if (callback) {
            this.subscribes[event] = this.subscribes[event].filter(subscriberCallback => subscriberCallback !== callback)
        } else {
            delete this.subscribes[event]
        }
    }
}
