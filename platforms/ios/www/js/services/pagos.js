angular.module('app')
  .service('PagosService', ['$http', '$q' , 'CONFIG', pagosService]);

  function pagosService($http, $q, CONFIG) {

      var addUsuario = function(usuario){
          var defer = $q.defer();

          $http.post(CONFIG.URL + 'vertical/guardartokenusuario/', usuario)
          .success(function (datos) {
              defer.resolve(datos);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      var addProveedor = function(usuario){
          var defer = $q.defer();

          $http.post(CONFIG.URL + 'vertical/guardartokenproveedor/', usuario)
          .success(function (enc) {
              defer.resolve(enc);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      return {
          addUsuario    : addUsuario,
          addProveedor  : addProveedor,
      }
  }
