'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
        // Expose view variables
        $scope.$state = $state;
        $scope.authentication = Authentication;

        // Get the topbar menu
        $scope.menu = Menus.getMenu('topbar');

        // Toggle the menu items
        $scope.isCollapsed = false;
        $scope.toggleCollapsibleMenu = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function () {
            $scope.isCollapsed = false;
        });
  }
]);
angular.module('ui.bootstrap').controller('TabsDemoCtrl', function ($scope, $window) {
    $scope.tabs = [
        {
            title: 'Dynamic Title 1',
            content: 'Dynamic content 1'
        },
        {
            title: 'Dynamic Title 2',
            content: 'Dynamic content 2'
        }
  ];

    $scope.alertMe = function () {
        $scope.tabs.push({
            title: "new tab",
            content: "localhost:3000"
        });
        $window.alert('You\'ve selected the alert tab!');
    };
});
