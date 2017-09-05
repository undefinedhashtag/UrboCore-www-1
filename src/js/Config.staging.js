var App = App || {};

var baseURL = 'urbo-backend-staging.geographica.gs/api'

App.config = {
  'api_url' : 'httsp://' + baseURL,
  'ws_url' : 'wss://' + baseURL + '/',
  'map_position':[36.7196718,4.4167761],
  'layout' : 'basetheme',
  'map_zoom':17,
  'maps_prefix':  'staging_'
};