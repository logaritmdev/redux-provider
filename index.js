
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

	groups.forEach(function(group) {

		for (var key in group) {

			var handlers = providers[key]
			if (handlers == null) {
				handlers = providers[key] = []
			}

			handlers.push.apply(handlers, group[key])
		}
	})

	return function(obj) {

		var dispatch = obj.dispatch
		var getState = obj.getState

		return function(next) {

			return function(action) {

				var handlers = providers[action.type]
				if (handlers == null) {
					return next(action)
				}

				return Promise.all(handlers.map(function(handler) {

					return new Promise(function(success, failure) {

						var dispatcher = function(subaction) {

							if (subaction.type === action.type) {
								next(subaction)
								success(subaction)
								return
							}

							dispatch(subaction)
						}

						try {

							var response = handler.call(null, action, dispatcher, getState())
							if (response &&
								response.then) {
								response.then(success, function(err) {
									failure(err); console.error(err)
								})
							}

						} catch (err) {
							failure(err); console.error(err)
						}

					})
				}))
			}
		}
	}
}
