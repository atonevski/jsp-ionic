# Ionic Starter App

# angular.module is a global place for creating, registering and retrieving Angular modules
# 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
# the 2nd parameter is an array of 'requires'
angular.module 'app', ['ionic']
.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider.state 'home', {
      url:          '/home'
      templateUrl:  'views/home/home.html'
    }
    .state 'gr-home', {
      url:          '/gr-home'
      templateUrl:  'views/gr/gr-home.html'
    }
    .state 'gr', {
      url:          '/gr/:line'
      templateUrl:  'views/gr/gr.html'
      controller:   'GrController'
    }
    .state 'pr-home', {
      url:          '/pr-home'
      templateUrl:  'views/pr/pr-home.html'
    }
    .state 'pr', {
      url:          '/pr/:line'
      templateUrl:  'views/pr/pr.html'
      controller:   'PrController'
    }
  $urlRouterProvider.otherwise '/home'
.run ($ionicPlatform) ->
  $ionicPlatform.ready () ->
    if window.cordova && window.cordova.plugins.Keyboard
      # Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      # for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar true

      # Don't remove this line unless you know what you are doing. It stops the viewport
      # from snapping when text inputs are focused. Ionic handles this internally for
      # a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll true
    if window.StatusBar
      StatusBar.styleDefault()
.controller 'MyController', ($scope, $http) ->
  # gr
  $http.get 'data/gr.json'
    .success (data, status) ->
      $scope.gr = data
      gr_lines  = data.map (e) -> return e.line
      gr_lines  = gr_lines.filter (e, i, a) -> if i is a.indexOf(e) then true else false
      $scope.gr_lines = gr_lines
      console.log "Successfully loaded GR schedule (#{ data.length })"
      $scope.GR_NCOLS = 5  # narrow cols (portrait)
      $scope.GR_WCOLS = 13 # wide cols (landscape)
      $scope.gr_ncols = [0 ... $scope.GR_NCOLS]
      $scope.gr_nrows = [0 ... Math.ceil gr_lines.length / $scope.GR_NCOLS]
    .error (data, status) ->
      console.log "Error loading GR schedule: #{ status }"
  # pr
  $http.get 'data/pr.json'
    .success (data, status) ->
      $scope.pr = data
      pr_lines  = data.map (e) -> return e.line
      pr_lines  = pr_lines.filter (e, i, a) -> if i is a.indexOf(e) then true else false
      $scope.pr_lines = pr_lines
      console.log "Successfully loaded PR schedule (#{ data.length })"
      $scope.PR_NCOLS = 5  # narrow cols (portrait)
      $scope.PR_WCOLS = 13 # wide cols (landscape)
      $scope.pr_ncols = [0 ... $scope.PR_NCOLS]
      $scope.pr_nrows = [0 ... Math.ceil pr_lines.length / $scope.PR_NCOLS]
    .error (data, status) ->
      console.log "Error loading PR schedule: #{ status }"
.controller 'GrController', ($scope, $stateParams) ->
  today = (new Date()).getDay()
  day   = switch
            when today in [1 .. 5] then 'weekday'
            when today is 6 then 'Saturday'
            else 'Sunday'
  $scope.wday_to_mk =
    weekday:  'делник'
    Saturday: 'сабота'
    Sunday:   'недела'
  $scope.wday_to_en =
    'делник':   'weekday'
    'сабота':   'Saturday'
    'недела':   'Sunday'
  line = $stateParams.line
  schedule = $scope.gr.filter (ln) ->
    ln.line is line and ln.schedule is day
  $scope.wday =
    mk: $scope.wday_to_mk[day]
    en: day
  $scope.line = line
  $scope.schedule = schedule[0]
  $scope.time = schedule[0].table_a.map (e) -> Object.keys(e)[0]

  console.log "wday is #{ $scope.wday.mk } #{ $scope.wday.en }"
  $scope.wday_changed = () ->
    console.log "> #{ $scope.wday.mk }"
    $scope.wday.en = $scope.wday_to_en[$scope.wday.mk]
    schedule = $scope.gr.filter (ln) ->
      ln.line is line and ln.schedule is $scope.wday.en
    $scope.schedule = schedule[0]
    console.log "wday is #{ $scope.wday.mk } #{ $scope.wday.en }"

.controller 'PrController', ($scope, $stateParams) ->
  today = (new Date()).getDay()
  day   = switch
            when today in [1 .. 5] then 'weekday'
            when today is 6 then 'Saturday'
            else 'Sunday'
  $scope.wday_to_mk =
    weekday:  'делник'
    Saturday: 'сабота'
    Sunday:   'недела'
  $scope.wday_to_en =
    'делник':   'weekday'
    'сабота':   'Saturday'
    'недела':   'Sunday'
  line = $stateParams.line
  schedule = $scope.pr.filter (ln) ->
    ln.line is line and ln.schedule is day
  $scope.wday =
    mk: $scope.wday_to_mk[day]
    en: day
  $scope.line = line
  $scope.schedule = schedule[0]

  console.log "wday is #{ $scope.wday.mk } #{ $scope.wday.en }"
  $scope.wday_changed = () ->
    console.log "> #{ $scope.wday.mk }"
    $scope.wday.en = $scope.wday_to_en[$scope.wday.mk]
    schedule = $scope.pr.filter (ln) ->
      ln.line is line and ln.schedule is $scope.wday.en
    $scope.schedule = schedule[0]
    console.log "wday is #{ $scope.wday.mk } #{ $scope.wday.en }"
