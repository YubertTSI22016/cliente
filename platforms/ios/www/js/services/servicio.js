angular.module('app')
  .service('ServicioService', ['$http', '$q' , 'CONFIG', servicioService]);

  function servicioService($http, $q, CONFIG) {
      var datos = [
        {
          id            : 1,
          nombre        : 'titulo 1',
          descripccion  : 'descripccion 1'
        }, {
          id            : 2,
          nombre        : 'titulo 2',
          descripccion  : 'descripccion 2'
        }, {
          id            : 3,
          nombre        : 'titulo 3',
          descripccion  : 'descripccion 3'
        }
      ];

      var getActivos = function(){
          var defer = $q.defer();

          defer.resolve(datos);

          // $http.get(CONFIG.URL + '/usuarios/')
          // .success(function (datos) {
          //     defer.resolve(datos);
          // })
          // .error(function(){
          //     defer.reject('server error')
          // });

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
          pedir       : pedir,
          ofrecer     : ofrecer,
          getById     : getById,
          finalizar   : finalizar,
          calificar   : calificar,
          getActivos  : getActivos,
      }
  }
