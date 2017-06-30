# Redux Provider
Redux provider is a middleware that abstract (mostly) async operations in its own layer. An action that is registered as a provider will be invoked first and the original action will be executed only when the provider dispatches the same action.

## Setup

### Create a provider file
```javascript
import {createProviders} from 'redux-provider'

var providers = {

	FETCH_DATA: function(action, dispatch) {

		var data = action.data

		dispatch({
			type: 'FETCH_DATA_REQUEST',
			data: data
		})

		request('GET', '/data').then(response => {

			// Dispatch the action with the data
			dispatch({
				type: 'FETCH_DATA',
				data: response
			})

			dispatch({
				type: 'FETCH_DATA_SUCCESS',
				data: data
			})

		}).catch(err => dispatch({
			type: 'FETCH_DATA_FAILURE',
			data: data
		}))
	}
}

export default createProviders(providers)
```

### Registers the middleware and providers

```javascript
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {providerMiddleware} from 'redux-provider'
import provider1 from './provider1'
import provider2 from './provider2'
const store = createStore(
	combineReducers(/* reducers */),
	applyMiddleware(
		providerMiddleware([provider1, provider2])
	)
)


## Licence
MIT
```