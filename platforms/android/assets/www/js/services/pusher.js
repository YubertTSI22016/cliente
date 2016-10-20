angular.module('app')
  .service('PusherService', ['$pusher', 'CONFIG', pusherService]);

  function pusherService($pusher, CONFIG) {
    var client  = new Pusher(CONFIG.PUSHER_KEY, {
      encrypted: true
    });
    var pusher  = $pusher(client);

    var usuarioChannel      = pusher.subscribe(CONFIG.TENANT + '-usuario');
    var proveedoresChannel  = pusher.subscribe(CONFIG.TENANT + '-proveedores');

    var unbindAll = function(){
      usuarioChannel.unbind();
      proveedoresChannel.unbind();
    };

    return {
      pusher              : pusher,
      usuarioChannel      : usuarioChannel,
      proveedoresChannel  : proveedoresChannel,
      unbindAll           : unbindAll
    }
  }
