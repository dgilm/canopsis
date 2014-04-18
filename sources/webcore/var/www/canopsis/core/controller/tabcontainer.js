define([
'jquery',
'app/lib/ember',
'app/application',
'app/model/container'
], function($, Ember, Application, Container ){

  Application.ContainerRoute = Application.AuthenticatedRoute.extend({    
  	setupController: function(controller, model){
      console.log("ContainerRoute setupController");
      controller.set('content', model);
      controller.set('toolitems', controller.toolbar);
    },

    model: function() {
      console.log("model");
      return this.store.findAll('container');
    }
  });

  Application.TabContainerController = Application.ContainerController.extend({});

return Application.ContainerController;
});