angular.module('app')
  .service('registroService', ['$http', '$q' , 'CONFIG', registroService]);

  function registroService($http, $q, CONFIG) {

    var algo = function(usuarioId){
          var defer = $q.defer();

          $http.post(CONFIG.URL + 'vertical/crearconfig/', {"transporte": "false"})
          .success(function (datos) {
              alert(datos)
              defer.resolve(datos);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      var getAll = function(usuarioId){
          var defer = $q.defer();

          $http.get(CONFIG.URL + '/usuarios/' + usuarioId)
          .success(function (datos) {
              defer.resolve(datos);
          })
          .error(function(){
              defer.reject('server error')
          });

          return defer.promise;
      };

      return {
          getAll : getAll,
          algo : algo
      }
  }
