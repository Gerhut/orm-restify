angular.module('ormRestify.user')
  .directive('user', ['user', function (user) {
    // Runs during compile
    return {
      // name: '',
      // priority: 1,
      // terminal: true,
      // scope: {}, // {} = isolate, true = child, false/undefined = no change
      controller: function($scope, $element, $attrs, $transclude) {

        $scope.$watch(function () {
          return user.getId()
        }, function (id) {
          $scope.id = id
        })
        
        $scope.$watch(function () {
          return user.getAccess()
        }, function (access) {
          $scope.access = access
        })

        $scope.register = function (id, password, confirmPassword) {

          $scope.alert = null

          if (password !== confirmPassword)
            return ($scope.alert = '两次密码不同')

          user.register(id, password, function (message) {
            if (message)
              return ($scope.alert = message)
            
            $scope.login(id, password)
          })
        }

        $scope.login = function (id, password) {

          $scope.alert = null
    
          user.login(id, password, function (message, access) {
            if (message)
              return ($scope.alert = message)

            $scope.isOpen = false
          })
        }

        $scope.changePassword = function (oldPassword, newPassword, confirmPassword) {

          $scope.alert = null

          if (newPassword !== confirmPassword)
            return ($scope.alert = '两次密码不同')

          user.changePassword(oldPassword, newPassword, function (message) {
            if (message)
              return ($scope.alert = message)
            
            $scope.login($scope.id, newPassword)
          })

        }

        $scope.logout = function () {
          user.logout()
          $scope.isOpen = false
        }
      },
      // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      // template: '',
      templateUrl: 'app/user/template.html',
      replace: true,
      // transclude: true,
      // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
      // link: function($scope, iElm, iAttrs, controller) {}
    };
  }]);