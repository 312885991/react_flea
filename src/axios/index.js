import fetch from './service'

export default class Axios {

    // 请求自己的API
    static get(options) {
        return fetch({
            url: options.url,
            method: 'GET',
            params: options.params
        })
    }

    static post(options) {
        return fetch({
            url: options.url,
            method: 'POST',
            data: options.data
        })
    }

    static put(options) {
        return fetch({
            url: options.url,
            method: 'PUT',
            data: options.data
        })
    }

    static delete(options) {
        return fetch({
            url: options.url,
            method: 'DELETE',
            params: options.params
        })
    }
}