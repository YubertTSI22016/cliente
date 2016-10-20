/**
 * @ngdoc service
 * @name Projects
 * @description
 * _Please update the description and dependencies._
 *
 * */
angular.module('app.map')

  .factory('Projects', function ($q, $timeout) {

    var getAll = function() {

      var deferred = $q.defer();

      $timeout( function(){
        deferred.resolve([
          {
            "id" : "1",
            "name" : "Project with a very long name",
            "description" : "project 1 description",
            "image" : "http://assets.inhabitat.com/wp-content/blogs.dir/1/files/2014/11/WIDC-Michael-Green-Wood-Building-7-537x368.jpg",
            "coordinates" : {
              "lat"  : "40.7108495",
              "long" : "-74.0085115"
            }
          },
          {"id" : "2", "name" : "85 Broad Street", "description" : "This building is located near CASE Uy office", "coordinates" : {"lat"  : "40.7109164", "long" : "-74.0059044"}, "image": "http://www.seattlechildrens.org/uploadedImages/Building%20Hope%20Exterior.JPG"},
          {"id" : "3", "name" : "79 Madison Avenue", "description" : "project 3 description", "coordinates" : {"lat"  : "40.7061994", "long" : "-74.0107431"}, "image": "https://upload.wikimedia.org/wikipedia/commons/7/73/Hanover_Building,_Manchester.jpg"},
          {"id" : "4", "name" : "63 Flushing Avenue, Brooklyn, NY 11205", "description" : "project 4 description", "coordinates" : {"lat"  : "40.7016984", "long" : "-74.0120777"}, "image": "http://www.hoylakejunction.com/wp-content/uploads/2009/06/old-building.jpg"},
          {"id" : "5", "name" : "85 Broad Street", "description" : "This building is located near CASE Uy office", "coordinates" : {"lat"  : "40.7109164", "long" : "-74.0059044"}, "image": "http://www.seattlechildrens.org/uploadedImages/Building%20Hope%20Exterior.JPG"},
          {"id" : "6", "name" : "79 Madison Avenue", "description" : "project 3 description", "coordinates" : {"lat"  : "40.7061994", "long" : "-74.0107431"}, "image": "https://upload.wikimedia.org/wikipedia/commons/7/73/Hanover_Building,_Manchester.jpg"},
          {"id" : "7", "name" : "63 Flushing Avenue, Brooklyn, NY 11205", "description" : "project 4 description", "coordinates" : {"lat"  : "40.7016984", "long" : "-74.0120777"}, "image": "http://www.hoylakejunction.com/wp-content/uploads/2009/06/old-building.jpg"},
          {"id" : "2", "name" : "85 Broad Street", "description" : "This building is located near CASE Uy office", "coordinates" : {"lat"  : "40.7109164", "long" : "-74.0059044"}, "image": "http://www.seattlechildrens.org/uploadedImages/Building%20Hope%20Exterior.JPG"},
          {"id" : "3", "name" : "79 Madison Avenue", "description" : "project 3 description", "coordinates" : {"lat"  : "40.7061994", "long" : "-74.0107431"}, "image": "https://upload.wikimedia.org/wikipedia/commons/7/73/Hanover_Building,_Manchester.jpg"},
          {"id" : "4", "name" : "63 Flushing Avenue, Brooklyn, NY 11205", "description" : "project 4 description", "coordinates" : {"lat"  : "40.7016984", "long" : "-74.0120777"}, "image": "http://www.hoylakejunction.com/wp-content/uploads/2009/06/old-building.jpg"},
          {"id" : "5", "name" : "85 Broad Street", "description" : "This building is located near CASE Uy office", "coordinates" : {"lat"  : "40.7109164", "long" : "-74.0059044"}, "image": "http://www.seattlechildrens.org/uploadedImages/Building%20Hope%20Exterior.JPG"},
          {"id" : "6", "name" : "79 Madison Avenue", "description" : "project 3 description", "coordinates" : {"lat"  : "40.7061994", "long" : "-74.0107431"}, "image": "https://upload.wikimedia.org/wikipedia/commons/7/73/Hanover_Building,_Manchester.jpg"},
          {"id" : "7", "name" : "63 Flushing Avenue, Brooklyn, NY 11205", "description" : "project 4 description", "coordinates" : {"lat"  : "40.7016984", "long" : "-74.0120777"}, "image": "http://www.hoylakejunction.com/wp-content/uploads/2009/06/old-building.jpg"}

        ]);

      }, 500);

      return deferred.promise;
    };

    return {
      getAll : getAll
    }

  });

