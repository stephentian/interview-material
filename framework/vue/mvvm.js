/**
 * @description: mvvm
 * @author: stephen
 * @date: 2022-07-02
 **/

// es6
class MVVM {
  constructor(options) {
		this._data = options.data
		this._methods = options.methods

		Object.keys.(this._data).foreach(key => {
			this._proxy(key)
		})

		observe(this._data)

		new Compile(options.el, this)
	}

	_proxy(key) {
		Object.defineProperties(this, key, {
			enumerable: false,
			configurable: true,
			get() {
				return this._data[key]
			},
			set(newValue) {
				this._data[key] = newValue
			}
		})
	}
}

class Observer {}

class Compile {}
