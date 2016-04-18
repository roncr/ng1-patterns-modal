angular.module('app')
.controller('HomeController', ['$modal', function($modal) {
    this.title = 'Home';

    this.open = function(){
        $modal.open({
            templateUrl: 'src/js/controllers/modal/modal-message.html',
            controller: 'ModalMessageController'
        });
    };
}]);