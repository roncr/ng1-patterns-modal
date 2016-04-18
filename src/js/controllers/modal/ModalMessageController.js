angular.module('app')
.controller('ModalMessageController', function($scope) {
    console.log('[ModalMessageController]', 'somebody just invoked me');
    $scope.message = 'Hello World!';
});