angular.module('app')
  .service('UsuarioService', ['$http', '$q' , 'CONFIG', usuarioService]);

  function usuarioService($http, $q, CONFIG) {

      var login = function(usuario){
          var defer = $q.defer();

          $http.post(CONFIG.URL + 'vertical/loginusuario', usuario)
          .success(function (dato) {
              defer.resolve(dato);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      var loginFacebook = function(usuario){
          var defer = $q.defer();

          $http.post(CONFIG.URL + 'vertical/loginaltafacebook', usuario)
          .success(function (dato) {
              defer.resolve(dato);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      var add = function(usuario){
          var defer = $q.defer();

          $http.post(CONFIG.URL + 'vertical/altausuario/', usuario)
          .success(function (datos) {
              defer.resolve(datos);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      var edit = function(usuario){
          var defer = $q.defer();

          $http.post(CONFIG.URL + 'vertical/modificarusuario/', usuario)
          .success(function (enc) {
              defer.resolve(enc);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      return {
          add           : add,
          edit          : edit,
          login         : login,
          loginFacebook : loginFacebook,
      }
  }
