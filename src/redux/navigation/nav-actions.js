/** Route Actions
 * 
 *  This file lays out some basic actions for use with react-navigation
 *  It exists for ease of use and a bit of abstraction so that any component connected to the store can dispatch them to manipulate the router state.
 */

import { NavigationActions } from 'react-navigation'

/**
 *  This action navigates to the specified route
 * 
 * @param {string} routeName - the name of the route to navigate to. Must be defined in a navigator's routes config
 * @param {object} params - (OPTIONAL) a maping of parameters to be passed to the route
 */
export const navigate = (routeName, params={}) => {
  return NavigationActions.navigate({
    routeName,
    params,
  })
}

/**
 * This action resets the stack of routes and places the specified route as the initial and only route
 * 
 * A similar action could reset the stack with an array of routes and specify which is active through the index paran
 * 
 * @param {string} routeName - the name of the route to navigate to. Must be defined in a navigator's routes config
 * @param {object} params - (OPTIONAL) parammeters to be passed to the route
 */
export const reset = (routeName, params={}) => {
  return NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName, params })
    ]
  })
}

/**
 * Simple moves back in the stack. Does nothing there is only one route
 */
export const back = () => {
  return NavigationActions.back()
}

/**
 * Refreshed a route with the given params
 * 
 * @param {string} key - the key of the route to be refreshed with new params
 * @param {object} params - the params to refresh the route with
 */
export const refresh = (key, params={}) => {
  return NavigationActions.setParams({
    key,
    params, 
  })
}