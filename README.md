# AngularJS Patterns - Modal

This mini-project is part of the AngularJS Patterns, in this occasion the modal pattern.

The modal pattern is where a component is instantiated, rendered and managed by a service. The directive itself never is used directly in the DOM, instead the developer
always uses the directive through the service.

This is really common in the modal component, since the modal can take many content, shapes and behaviors, it is pointless to define and modal directive in the DOM
and changing the content to show. Instead, the modal pattern exposes an API through a [provider](https://docs.angularjs.org/guide/providers) (service), this APIs allows the developer to render or remove the directive
in the screen. With this pattern, it is common that the element is added directly to the body, or the element to which it should be appended could be a parameter.

The service, internally creates a DOM element, compiles it with the [$compile](https://docs.angularjs.org/api/ng/service/$compile) service an injects the compiled element into the either the body or the element provided by the developer.

The controller is instantiated using the [$controller](https://docs.angularjs.org/api/ng/service/$controller) service, custom parameters can be passed to the controller, one of those custom parameters could be a service to manipulate the modal from the inside of the content (controller attached to the template).

The modal service is in charge or removing the DOM element an cleaning up everything, it could even have a stack of opened modals to open multiple modals (not implemented in this mini-project).

If just want to check the code that matters, simply go to [modal.js](https://github.com/roncr/ng1-patterns-modal/blob/master/src/js/components/modal/modal.js) file.

## Usage

    // HomeController.js
    angular.module('app')
    .controller('HomeController', ['$modal', function($modal) {
        this.open = function(){
            $modal.open({
                templateUrl: 'src/js/controllers/modal/modal-message.html',
                controller: 'ModalMessageController'
            });
        };
    }]);

## Tasks

To run the app, simply:

    npm start

#### Disclaimer

This is a mini-project intended only as an example of the modal pattern. This project lacks of structure and good practices, it is not either a complete implementation of a modal manager component.