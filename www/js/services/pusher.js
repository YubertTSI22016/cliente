angular.module('app')
  .service('PusherService', ['$pusher', 'CONFIG', '$ionicUser', pusherService]);

  function pusherService($pusher, CONFIG, $ionicUser) {
    var client  = new Pusher(CONFIG.PUSHER_KEY, {
      encrypted : true
    });
    var pusher  = $pusher(client);

    var usuario = $ionicUser.get('info') || {};

    var usuarioChannel      = usuario ? pusher.subscribe(CONFIG.TENANT_ID + '-usuario-' + usuario.id) : null;
    var proveedoresChannel  = pusher.subscribe(CONFIG.TENANT_ID + '-proveedores');

    var unbindAll = function(){
      if(usuarioChannel){
        usuarioChannel.unbind();
      }
      proveedoresChannel.unbind();
    };

    return {
      pusher              : pusher,
      usuarioChannel      : usuarioChannel,
      proveedoresChannel  : proveedoresChannel,
      unbindAll           : unbindAll
    }
  }
