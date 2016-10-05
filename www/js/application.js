var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('app', ['ionic']).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'views/home/home.html'
  }).state('gr-home', {
    url: '/gr-home',
    templateUrl: 'views/gr/gr-home.html'
  }).state('gr', {
    url: '/gr/:line',
    templateUrl: 'views/gr/gr.html',
    controller: 'GrController'
  }).state('pr-home', {
    url: '/pr-home',
    templateUrl: 'views/pr/pr-home.html'
  }).state('pr', {
    url: '/pr/:line',
    templateUrl: 'views/pr/pr.html',
    controller: 'PrController'
  });
  return $urlRouterProvider.otherwise('/home');
}).run(function($ionicPlatform) {
  return $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      return StatusBar.styleDefault();
    }
  });
}).controller('MyController', function($scope, $http) {
  $http.get('data/gr.json').success(function(data, status) {
    var gr_lines, j, k, ref, ref1, results, results1;
    $scope.gr = data;
    gr_lines = data.map(function(e) {
      return e.line;
    });
    gr_lines = gr_lines.filter(function(e, i, a) {
      if (i === a.indexOf(e)) {
        return true;
      } else {
        return false;
      }
    });
    $scope.gr_lines = gr_lines;
    console.log("Successfully loaded GR schedule (" + data.length + ")");
    $scope.GR_NCOLS = 5;
    $scope.GR_WCOLS = 13;
    $scope.gr_ncols = (function() {
      results = [];
      for (var j = 0, ref = $scope.GR_NCOLS; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this);
    return $scope.gr_nrows = (function() {
      results1 = [];
      for (var k = 0, ref1 = Math.ceil(gr_lines.length / $scope.GR_NCOLS); 0 <= ref1 ? k < ref1 : k > ref1; 0 <= ref1 ? k++ : k--){ results1.push(k); }
      return results1;
    }).apply(this);
  }).error(function(data, status) {
    return console.log("Error loading GR schedule: " + status);
  });
  return $http.get('data/pr.json').success(function(data, status) {
    var j, k, pr_lines, ref, ref1, results, results1;
    $scope.pr = data;
    pr_lines = data.map(function(e) {
      return e.line;
    });
    pr_lines = pr_lines.filter(function(e, i, a) {
      if (i === a.indexOf(e)) {
        return true;
      } else {
        return false;
      }
    });
    $scope.pr_lines = pr_lines;
    console.log("Successfully loaded PR schedule (" + data.length + ")");
    $scope.PR_NCOLS = 5;
    $scope.PR_WCOLS = 13;
    $scope.pr_ncols = (function() {
      results = [];
      for (var j = 0, ref = $scope.PR_NCOLS; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this);
    return $scope.pr_nrows = (function() {
      results1 = [];
      for (var k = 0, ref1 = Math.ceil(pr_lines.length / $scope.PR_NCOLS); 0 <= ref1 ? k < ref1 : k > ref1; 0 <= ref1 ? k++ : k--){ results1.push(k); }
      return results1;
    }).apply(this);
  }).error(function(data, status) {
    return console.log("Error loading PR schedule: " + status);
  });
}).controller('GrController', function($scope, $stateParams) {
  var day, line, schedule, today;
  today = (new Date()).getDay();
  day = (function() {
    switch (false) {
      case indexOf.call([1, 2, 3, 4, 5], today) < 0:
        return 'weekday';
      case today !== 6:
        return 'Saturday';
      default:
        return 'Sunday';
    }
  })();
  $scope.wday_to_mk = {
    weekday: 'делник',
    Saturday: 'сабота',
    Sunday: 'недела'
  };
  $scope.wday_to_en = {
    'делник': 'weekday',
    'сабота': 'Saturday',
    'недела': 'Sunday'
  };
  line = $stateParams.line;
  schedule = $scope.gr.filter(function(ln) {
    return ln.line === line && ln.schedule === day;
  });
  $scope.wday = {
    mk: $scope.wday_to_mk[day],
    en: day
  };
  $scope.line = line;
  $scope.schedule = schedule[0];
  $scope.time = schedule[0].table_a.map(function(e) {
    return Object.keys(e)[0];
  });
  console.log("wday is " + $scope.wday.mk + " " + $scope.wday.en);
  return $scope.wday_changed = function() {
    console.log("> " + $scope.wday.mk);
    $scope.wday.en = $scope.wday_to_en[$scope.wday.mk];
    schedule = $scope.gr.filter(function(ln) {
      return ln.line === line && ln.schedule === $scope.wday.en;
    });
    $scope.schedule = schedule[0];
    return console.log("wday is " + $scope.wday.mk + " " + $scope.wday.en);
  };
}).controller('PrController', function($scope, $stateParams) {
  var day, line, schedule, today;
  today = (new Date()).getDay();
  day = (function() {
    switch (false) {
      case indexOf.call([1, 2, 3, 4, 5], today) < 0:
        return 'weekday';
      case today !== 6:
        return 'Saturday';
      default:
        return 'Sunday';
    }
  })();
  $scope.wday_to_mk = {
    weekday: 'делник',
    Saturday: 'сабота',
    Sunday: 'недела'
  };
  $scope.wday_to_en = {
    'делник': 'weekday',
    'сабота': 'Saturday',
    'недела': 'Sunday'
  };
  line = $stateParams.line;
  schedule = $scope.pr.filter(function(ln) {
    return ln.line === line && ln.schedule === day;
  });
  $scope.wday = {
    mk: $scope.wday_to_mk[day],
    en: day
  };
  $scope.line = line;
  $scope.schedule = schedule[0];
  console.log("wday is " + $scope.wday.mk + " " + $scope.wday.en);
  return $scope.wday_changed = function() {
    console.log("> " + $scope.wday.mk);
    $scope.wday.en = $scope.wday_to_en[$scope.wday.mk];
    schedule = $scope.pr.filter(function(ln) {
      return ln.line === line && ln.schedule === $scope.wday.en;
    });
    $scope.schedule = schedule[0];
    return console.log("wday is " + $scope.wday.mk + " " + $scope.wday.en);
  };
});
