angular.module('app', ['ionic', 'ionic.cloud', 'uiGmapgoogle-maps', 'pusher-angular', 'app.map'])

.constant('CONFIG', {
  'URL'             : 'http://172.20.10.3:8080/yuberapi/rest/',
  'TENANT'          : 'tenant',
  'TENANTID'        : 'b378b367-b024-4168-86dc-fdf0c21ee200',
  'FACEBOOK'        : true,
  'PUSHER_KEY'      : 'c2f52caa39102181e99f',
  'NOMBRE_EMPRESA'  : 'YUBER',
})

.run(function($ionicPlatform, $rootScope, CONFIG) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });

  $rootScope.CONFIG = CONFIG;
})

.config(function($stateProvider, $urlRouterProvider, $ionicCloudProvider, uiGmapGoogleMapApiProvider, CONFIG, $httpProvider) {
  $ionicCloudProvider.init({
    'core' : {
      'app_id' : '324566f8'
    }
  });

  uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es',
      v: '3.20', //defaults to latest 3.X anyhow
      libraries: 'weather,geometry,visualization'
  });

  $httpProvider.defaults.headers.common['yuber-tenant'] = CONFIG.TENANTID;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');

  $stateProvider
    /**
     * welcome screen
     */
    .state('welcome', {
      url         : '/welcome',
      cache       : false,
      controller  : 'WelcomeCtrl',
      templateUrl : 'templates/welcome.html'
    })

    /**
     * map states
     */
    .state('locations', {
      url         : '/locations',
      cache       : false,
      abstract    : true,
      templateUrl : 'templates/locations/abstract.html'
    })

    .state('locations.proveedor', {
      url   : '/proveedor',
      cache : false,
      views : {
        'view-container' : {
          templateUrl : 'templates/locations/_proveedor.html',
          controller  : 'ProveedorCtrl'
        }
      }
    })
    .state('locations.usuario', {
      url   : '/usuario',
      cache : false,
      views : {
        'view-container' : {
          templateUrl : 'templates/locations/_usuario.html',
          controller  : 'UsuarioCtrl'
        }
      }
    })
    .state('locations.servicios', {
      url   : '/servicios',
      cache : false,
      views : {
        'view-container' : {
          templateUrl : 'templates/locations/_servicios.html',
          controller  : 'ServicioCtrl'
        }
      }
    }).state('locations.detalle', {
      url   : '/servicios/:id',
      cache : false,
      views : {
        'view-container' : {
          templateUrl : 'templates/locations/_detalle-servicio.html',
          controller  : 'ServicioCtrl'
        }
      }
    }).state('locations.calificar', {
      url   : '/calificar/:id',
      cache : false,
      views : {
        'view-container' : {
          templateUrl : 'templates/locations/_calificar.html',
          controller  : 'CalificarCtrl'
        }
      }
    }).state('locations.pagos', {
      url   : '/pagos',
      cache : false,
      views : {
        'view-container' : {
          templateUrl : 'templates/locations/_pagos.html',
          controller  : 'PagosCtrl'
        }
      }
    });
})

.controller('WelcomeCtrl', function ($scope, CONFIG, $ionicModal, $state, $ionicPopup, $window, $ionicAuth, $ionicUser, registroService) {
    $scope.loginData    = {
      username : 'user@user.com',
      password : 'user',
    };
    $scope.registroData = {};

    registroService.algo().then(function(proveedor){

    });

    if ($ionicAuth.isAuthenticated()) {
      $state.go('locations.usuario');
    }

    $scope.backToWelcomePage = function(){
      $scope.modal.hide();
      $state.go('welcome');
    };

    $scope.login = function() {
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope : $scope
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.registro = function() {
      $ionicModal.fromTemplateUrl('templates/registro.html', {
        scope : $scope
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.forgot = function() {
      window.open($ionicAuth.passwordResetUrl, '_blank', 'location=yes');
    };

    $scope.doLogin = function() {
      var username = $scope.loginData.username;
      var password = $scope.loginData.password;

      var details = { 'email' : username, 'password' : password };

      $ionicAuth.login('basic', details).then(function(){
        $scope.modal.hide();
        $state.go('locations.usuario');
      });
    };

    $scope.doFacebookLogin = function(){
      $ionicAuth.login('facebook').then( function(success) {
        $state.go('locations.usuario');
      }, function(err) {
          alert(err.message);
      });
    };

    $scope.doRegistro = function() {
      var username = $scope.registroData.username;
      var password = $scope.registroData.password;

      var details = { 'email' : username, 'password' : password };

      $ionicAuth.signup(details).then(function() {
        $scope.modal.hide();
        $state.go('locations.usuario');
      }, function(err) {
        alert(err.message);
      });
    };

});
