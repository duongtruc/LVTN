'use strict';

angular.module('core').controller('HomeController', ['$scope', '$modal', 'Authentication', 'Articles', 'Users',
  function ($scope, $modal, Authentication, Articles, Users) {
        // This provides Authentication context.
        $scope.tabIndex = 0;
        $scope.authentication = Authentication;
        $scope.createTicket = function() {
            $scope.tickets.push({tabIndex: $scope.tabIndex++, active: 'active'});
        };
        // Create new Article
        $scope.create = function (tabIndex) {
            // Create new Article object
            //tabIndex = parseInt(tabIndex);
            var newTicket = $scope.tickets[tabIndex];
            var article = new Articles({
                title: newTicket.title,
                content: newTicket.newReply,
                type: newTicket.type,
                prioriry: newTicket.priority
            });
            // Redirect after save
            article.$save(function (response) {
                //$location.path('articles/' + response._id);
                // Clear form fields
                $scope.tickets[tabIndex] = response;
                console.log(response);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.tickets = [];
        $scope.animationsEnabled = true;

        $scope.createnewuser = function (size) {

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myUser.html',
                controller: 'NewUserController',
                size: size
            });
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        };
  }
]);
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
        $scope.authentication = Authentication;
        // Create new Article
        /*
        $scope.create = function () {
            // Create new Article object
            var article = new Articles({
                title: this.title,
                content: this.content,
                type: this.type,
                prioriry: this.priority
            });
            console.log(article);
            // Redirect after save
            article.$save(function (response) {
                $location.path('articles/' + response._id);
                // Clear form fields
                $scope.title = '';
                $scope.content = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
*/
        // Remove existing Article
        $scope.remove = function (article) {
            if (article) {
                article.$remove();

                for (var i in $scope.articles) {
                    if ($scope.articles[i] === article) {
                        $scope.articles.splice(i, 1);
                    }
                }
            } else {
                $scope.article.$remove(function () {
                    $location.path('articles');
                });
            }
        };
        $scope.requesters = [
            {
                displayName: "Nguyen Truc",
                _id: "55d355a8162d70580f04716f"
            },
            {
                displayName: "Nguyen Truc 2",
                _id: "55e2959d7558542c2563fb9e"
            }
        ];
        // Update existing Article
        $scope.update = function () {
            var article = $scope.article;
            article.$update(function (article) {
                $scope.article = article;
                $scope.msg = {
                    type: "success",
                    content: "Ticket has been updated"
                };
                //$location.path('articles/' + article._id);
            }, function (errorResponse) {
                $scope.msg = {
                    type: "danger",
                    content: "Can not update ticket"
                };
                //$scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Articles
        $scope.find = function () {
            $scope.articles = Articles.query();
        };

        // Find existing Article
        $scope.findOne = function () {
            $scope.article = Articles.get({
                articleId: $stateParams.articleId
            });
        };
  }
]);
