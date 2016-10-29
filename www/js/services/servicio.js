angular.module('app')
  .service('ServicioService', ['$http', '$q' , 'CONFIG', servicioService]);

  function servicioService($http, $q, CONFIG) {
      var getServicios = function(id){
          var defer = $q.defer();

          $http.get(CONFIG.URL + 'vertical/listarservicios/' + id)
          .success(function (datos) {
              defer.resolve(datos);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      var getById = function(id){
          var defer = $q.defer();

          $http.get(CONFIG.URL + 'vertical/obtenerservicio/' + id)
          .success(function (datos) {
              defer.resolve(datos);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      var pedir = function(servicio){
          var defer = $q.defer();

          $http.post(CONFIG.URL + 'vertical/pedirservicio/', servicio)
          .success(function (datos) {
              defer.resolve(datos);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      var ofrecer = function(servicio){
          var defer = $q.defer();

          $http.post(CONFIG.URL + 'vertical/ofrecerservicio/', servicio)
          .success(function (datos) {
              defer.resolve(datos);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      var finalizar = function(servicio){
          var defer = $q.defer();

          $http.post(CONFIG.URL + 'vertical/finalizarservicio/', servicio)
          .success(function (datos) {
              defer.resolve(datos);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      var calificar = function(servicio){
          var defer = $q.defer();

          $http.post(CONFIG.URL + 'vertical/calificarservicio/', servicio)
          .success(function (datos) {
              defer.resolve(datos);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      return {
          pedir         : pedir,
          ofrecer       : ofrecer,
          getById       : getById,
          finalizar     : finalizar,
          calificar     : calificar,
          getServicios  : getServicios,
      }
  }
