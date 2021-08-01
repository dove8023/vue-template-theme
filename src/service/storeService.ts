var store = {
  get: function(key: any) {
    return localStorage.getItem(key)
  },
  set: function(key: any, value: any) {
    return localStorage.setItem(key, value)
  },
  clearAll() {
    for (var itemKey in localStorage) {
      localStorage.removeItem(itemKey)
    }
  }
}

export default class StoreService {
  static getToken() {
    return store.get('kgp-token')
  }

  static setToken(token: string) {
    store.set('kgp-token', token)
  }

  static clearAll() {
    store.clearAll()
  }

  static getData(key: any) {
    return store.get(key)
  }

  static setData(key: any, value: any) {
    store.set(key, value)
  }
}
