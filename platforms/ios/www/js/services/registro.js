angular.module('app')
  .service('registroService', ['$http', '$q' , 'CONFIG', registroService]);

  function registroService($http, $q, CONFIG) {

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
          getAll : getAll
      }
  }
