'use strict';

angular.module('users.admin').controller('NewUserController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users',
  function ($scope, $stateParams, $location, Authentication, Users) {

        //Create new User
        $scope.newuser = function () {
            //new User object
            var newUser = new Users({
                firstName: $scope.credentials.firstName,
                email: $scope.credentials.email,
                password: '123456789',
                roles: [$scope.credentials.roles]
            });

            //$save =  1 post request ...
            newUser.$save(function (response) {
                $scope.success = true;
                $scope.msg = {
                    type: "success",
                    content: "User has been created"
                };
                $scope.credentials.firstName = '';
                $scope.credentials.email = '';
            }, function (response) {
                $scope.error = response.data.message;
            });
        };
  }]);
