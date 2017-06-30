/**
 * @function invoke
 * @since 1.0.0
 * @hidden
 */
var invoke = function(functions, ...args) {
	functions.forEach(f => f(...args))
}

/**
 * @function createProviders
 * @since 1.0.0
 */
export function createProviders(providers) {

	var map = {}

	for (var key in providers) {

		var items = map[key]
		if (items == null) {
			items = map[key] = []
		}

		items.push(providers[key])
	}

	return map
}

/**
 * @function providerMiddleware
 * @since 1.0.0
 */
export function providerMiddleware(groups) {

	var providers = {}

	groups.forEach(group => {

		for (var key in group) {

			var handlers = providers[key]
			if (handlers == null) {
				handlers = providers[key] = []
			}

			handlers.push.apply(handlers, group[key])
		}
	})

	return ({ dispatch, getState }) => next => action => {

		var handlers = providers[action.type]
		if (handlers == null) {
			return next(action)
		}

		return new Promise((success, failure) => {

			var count = 0

			invoke(handlers, action, result => {

				// TODO, handle failure
				if (result.type !== action.type) {
					dispatch(result)
					return
				}

				next(result) // Original action

				if (handlers.length == ++count) {
					success(getState())
				}
			})
		})
	}
}
