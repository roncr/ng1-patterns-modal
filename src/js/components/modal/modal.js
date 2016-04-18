angular.module('app')

/*
 * A helper directive for the $modal service. It creates a backdrop element.
 */
.directive('modalBackdrop', [
    function() {
        function linkFn(scope, element, attrs) {
            // do something here if necessary
        }

        return {
            replace: true,
            template: '<div class="modal-backdrop"></div>',
            compile: function(tElement, tAttrs) {
                tElement.addClass(tAttrs.backdropClass);
                return linkFn;
            }
        };
    }])

/*
 * Directive to wrap the modal content. Uses transclusion to load the user
 * content into the modal. This wrapper enables the set styling like the
 * absolute and center positioning.
 */
.directive('modalWindow', [
    function() {
        return {
            template: '<div class="modal-window" ng-transclude></div>',
            scope: {},
            replace: true,
            transclude: true
        }
    }])

/*
 * Provider is used to expose an API for application-wide configuration that must be made before the
 * application starts. This is usually interesting only for reusable services whose behavior might need
 * to vary slightly between applications.
 */
.provider('$modal', function() {
    var $modalProvider = {
        // Options that can be changed during config phase
        options: {
            backdrop: true,
            keyboard: false
        },
        // Mandatory factory method of the provider
        $get: ['$rootScope', '$document', '$controller', '$compile', '$templateRequest', '$q',
            function($rootScope, $document, $controller, $compile, $templateRequest, $q) {
                var $modal = {};

                /**
                 * Creates a promise for the request of the template
                 * @param options object containing either the 'template' or 'templateUrl' properties
                 * @returns {Promise} the template request promise
                 */
                function getTemplatePromise(options) {
                    return options.template ? $q.when(options.template) :
                        $templateRequest(angular.isFunction(options.templateUrl) ?
                            options.templateUrl() : options.templateUrl);
                }

                /**
                 * Renders the backdrop and the modal in the screen
                 * @param options the definition options of the modal
                 */
                function render(options) {
                    var appendToElement = options.appendTo;

                    // Build & render backdrop
                    var backdropScope = $rootScope.$new(true),
                        backdropDomEl = angular.element('<div modal-backdrop="modal-backdrop"></div>');

                    backdropDomEl.attr('backdrop-class', 'modal-backdrop');
                    $compile(backdropDomEl)(backdropScope);
                    appendToElement.append(backdropDomEl);


                    // Build & render modal window
                    var modalWindowDomEl = angular.element('<div modal-window="modal-window"></div>');
                    modalWindowDomEl.html(options.content);
                    $compile(modalWindowDomEl)(options.scope);
                    appendToElement.append(modalWindowDomEl);
                }

                /**
                 * [Public API]
                 * Method to open the model
                 * @param modalOptions the parameters of the modal
                 */
                $modal.open = function(modalOptions){

                    // Setup parameters
                    var options = angular.extend({}, $modalProvider.options, modalOptions);
                    options.appendTo = options.appendTo || $document.find('body').eq(0);

                    // Validation of mandatory parameters
                    if (!options.template && !options.templateUrl) {
                        throw new Error('One of template or templateUrl options is required.');
                    }

                    // Generate a new scope.
                    var providedScope  = options.scope || $rootScope,
                        modalScope = providedScope.$new();

                    // Instantiate controller
                    if (options.controller) {
                        var ctrlLocals = {
                            $scope: modalScope
                            /* If wanted, other parameters could be attached to the ctrlLocals,
                             * for instance an object that exposes an API to the controller, for instance:
                             *
                             * $modalInstance: modalInstance: {
                             *     close: function() {}
                             * }
                             *
                             * This property will be injected into the modal/child controller with the
                             * same name. This will provide an API to the user to control the model
                             */
                        };
                        $controller(options.controller, ctrlLocals);
                    }

                    // Get template
                    getTemplatePromise(options).then(function(template){

                        // Now we have all we need, lets paint things on the screen
                        render({
                            scope: modalScope,
                            content: template,
                            backdrop: options.backdrop,
                            keyboard: options.keyboard,
                            appendTo: options.appendTo
                        });
                    });
                }

                // Exposes public API
                return $modal;
        }]
    };

    return $modalProvider;
});

/*
 * Footer developer notes:
 * This is a simple implementation of the modal pattern, there are other common features that could be implemented
 * like closing the modal when the user hits ESC. This could be achieved with many alternatives, one of those being:
 *
 * 1. Create a service that keeps track of the opened (or at least last opened) modals.
 * 2. When a modal is opened, it register itself to the given service.
 * 3. This service could attach a listener for the keydown.
 * 4. When the keydown is 27 (ESC), use the same service to close the latest opened modal.
 * 5. Once the model is closed, check if there are more modals opened, if not, remove the backdrop.
 *
 * This is a rough idea if the an alternative.
 */