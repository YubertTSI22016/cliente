angular.module('app', ['ionic', 'ionic.cloud', 'ionic.rating', 'uiGmapgoogle-maps', 'pusher-angular'])

.constant('CONFIG', {
  'IONIC_ID'        : '324566f8',
  'URL'             : '/yuberapi/rest/',
  // 'URL'             : 'http://10.0.22.195:8080/yuberapi/rest/',
  'TENANT_ID'       : 'b378b367-b024-4168-86dc-fdf0c21ee200',
  'TENANT'          : 'tenant',
  'FACEBOOK'        : true,
  'PUSHER_KEY'      : 'c2f52caa39102181e99f',
  'NOMBRE_EMPRESA'  : 'YUBER'
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
  $httpProvider.defaults.headers.common['yuber-tenant'] = CONFIG.TENANT_ID;

  $ionicCloudProvider.init({
    'core' : {
      'app_id' : CONFIG.IONIC_ID
    }
  });

  uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es',
      v: '3.20', //defaults to latest 3.X anyhow
      libraries: 'weather,geometry,visualization'
  });

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
    })
    .state('locations.serviciodetalle', {
      url   : '/servicios/:id',
      cache : false,
      views : {
        'view-container' : {
          templateUrl : 'templates/locations/_detalle-servicio.html',
          controller  : 'ServicioCtrl'
        }
      }
    })
    .state('locations.calificar', {
      url   : '/calificar/:id',
      cache : false,
      views : {
        'view-container' : {
          templateUrl : 'templates/locations/_calificar.html',
          controller  : 'CalificarCtrl'
        }
      }
    })
    .state('locations.pagos', {
      url   : '/pagos',
      cache : false,
      views : {
        'view-container' : {
          templateUrl : 'templates/locations/_pagos.html',
          controller  : 'PagosCtrl'
        }
      }
    })
    .state('locations.ganancias', {
      url   : '/ganancias',
      cache : false,
      views : {
        'view-container' : {
          templateUrl : 'templates/locations/_ganancias.html',
          controller  : 'GananciasCtrl'
        }
      }
    });
})

.controller('WelcomeCtrl', function ($scope, CONFIG, $ionicModal, $state, $ionicPopup, $window, $ionicAuth, $ionicUser, $ionicLoading, UsuarioService) {
    $scope.loginData    = {
      username : 'user@user.com',
      password : 'user',
    };
    $scope.registroData = {};

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

      $ionicLoading.show();

      var details = { 'email' : username, 'password' : password };
      var user    = { 'usuario' : username, 'clave' : password };

      $ionicAuth.login('basic', details).then( function(){
        UsuarioService.login(user).then(function (usuario) {
          $ionicUser.set('info', usuario);

          $scope.modal.hide();
          $ionicLoading.hide();
          $state.go('locations.usuario');
        }, function(err) {
          alert(err.message);
          $ionicAuth.logout();
          $ionicLoading.hide();
          $scope.backToWelcomePage();
        });
      }, function(err) {
          alert(err.message);
          $ionicAuth.logout();
          $ionicLoading.hide();
          $scope.backToWelcomePage();
      });
    };

    $scope.doFacebookLogin = function(){
      $ionicLoading.show();
      $ionicAuth.login('facebook').then( function(success) {
        var details = { 
          uid     : $ionicUser.social.facebook.data.uid + '',
          email   : $ionicUser.social.facebook.data.email,
          nombre  : $ionicUser.social.facebook.data.full_name
        }

        UsuarioService.loginFacebook(details).then(function(usuario){
          $ionicUser.set('info', usuario);
          $ionicUser.save();

          $ionicLoading.hide();
          $state.go('locations.usuario');
        }, function(err) {
          alert(err.message);
          $ionicAuth.logout();
          $ionicLoading.hide();
          $scope.backToWelcomePage();
        });
      }, function(err) {
          alert(err.message);
          $ionicAuth.logout();
          $ionicLoading.hide();
          $scope.backToWelcomePage();
      });
    };

    $scope.doRegistro = function() {
      var username  = $scope.registroData.username;
      var password  = $scope.registroData.password;
      var nombre    = $scope.registroData.nombre;
      var apellido  = $scope.registroData.apellido;

      $ionicLoading.show();

      var user    = { 'email' : { 'email' : username }, 'clave' : password, 'nombre' : nombre, 'apellido' : apellido };
      var details = { 'email' : username, 'password' : password, 'name' : nombre + ' ' + apellido };

      // registrar el usuario en yuber
      UsuarioService.add(user).then(function(usuario) {
        // registrar el usuario en ionic
        $ionicAuth.signup(details).then(function() {
          // iniciar sesion en ionic
          $ionicAuth.login('basic', { 'email' : username, 'password' : password }).then( function(){
            // iniciar session en yuber
            UsuarioService.login({ 'usuario' : username, 'clave' : password }).then(function () {
              $ionicUser.set('info', usuario);
              $ionicUser.save();

              $scope.modal.hide();
              $ionicLoading.hide();
              $state.go('locations.usuario');
            }, function(err) {
              alert(err.message);
              $ionicAuth.logout();
              $ionicLoading.hide();
              $scope.backToWelcomePage();
            });
          }, function(err) {
              alert(err.message);
              $ionicLoading.hide();
              $scope.backToWelcomePage();
          });
        }, function(err) {
          alert(err.message);
          $ionicLoading.hide();
          $scope.backToWelcomePage();
        });
      }, function(err) {
        alert(err.message);
        $ionicLoading.hide();
        $scope.backToWelcomePage();
      });
    };

});
