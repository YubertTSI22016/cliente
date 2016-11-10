angular.module('app', ['ionic', 'ionic.cloud', 'ionic.rating', 'uiGmapgoogle-maps', 'pusher-angular'])

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

  Stripe.setPublishableKey(CONFIG.STRIPE_KEY);
})

.config(function($stateProvider, $urlRouterProvider, $ionicCloudProvider, $ionicConfigProvider, uiGmapGoogleMapApiProvider, CONFIG, $httpProvider) {
  $httpProvider.defaults.headers.common['yuber-tenant'] = CONFIG.TENANT_ID;

  $ionicCloudProvider.init({
    'core' : {
      'app_id' : CONFIG.IONIC_ID
    }
  });

  uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyBxfPmvHbNozhPG_0934HjQV4mb7KoHkXE',
      v: '3.20', //defaults to latest 3.X anyhow
      libraries: 'weather,geometry,visualization,places'
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

.controller('WelcomeCtrl', function ($scope, CONFIG, $ionicModal, $state, $ionicPopup, $window, $ionicAuth, $ionicUser, $ionicLoading, UsuarioService, PusherService) {
    PusherService.unbindAll();
    
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

})

.directive('ngAutocomplete', function(uiGmapGoogleMapApi) {
    return {
      require: 'ngModel',
      scope: {
        ngModel: '=',
        options: '=?',
        details: '=?'
      },

      link : function(scope, element, attrs, controller) {
       
        //options for autocomplete
        var opts
        var watchEnter = false
        //convert options provided to opts
        var initOpts = function() {

          opts = {}
          if (scope.options) {

            if (scope.options.watchEnter !== true) {
              watchEnter = false
            } else {
              watchEnter = true
            }

            if (scope.options.types) {
              opts.types = []
              opts.types.push(scope.options.types)
              scope.gPlace.setTypes(opts.types)
            } else {
              scope.gPlace.setTypes([])
            }

            if (scope.options.bounds) {
              opts.bounds = scope.options.bounds
              scope.gPlace.setBounds(opts.bounds)
            } else {
              scope.gPlace.setBounds(null)
            }

            if (scope.options.country) {
              opts.componentRestrictions = {
                country: scope.options.country
              }
              scope.gPlace.setComponentRestrictions(opts.componentRestrictions)
            } else {
              scope.gPlace.setComponentRestrictions(null)
            }
          }
        }

        uiGmapGoogleMapApi.then(function(instances) {
          if (scope.gPlace == undefined) {
            scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
          }

          scope.gPlace.addListener('place_changed', function() {
            var result = scope.gPlace.getPlace();

            if (!result.geometry) {
              alert("Seleccione uno de la lista");
              return;
            }

            if (result !== undefined) {
              if (result.address_components !== undefined) {
                scope.$apply(function() {
                  scope.details = result;
                  // controller.$setViewValue(element.val());
                  controller.$setViewValue(result);
                });
              }
            }
          })
        });

        controller.$render = function () {
          var location = controller.$viewValue;
          element.val(location);
        };

        //watch options provided to directive
        scope.watchOptions = function () {
          return scope.options
        };
        scope.$watch(scope.watchOptions, function () {
          initOpts()
        }, true);
        
    }
  }
});
