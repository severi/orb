'use strict';
angular.module('app').controller('AppController', AppController);

function AppController($scope, $ionicModal, $timeout) {
  var vm = this;
  vm.loginData = {};
  vm.closeLogin = closeLogin;
  vm.login = login;
  vm.doLogin = doLogin;

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    vm.modal = modal;
  });

  function closeLogin() {
    vm.modal.hide();
  }

  function login() {
    vm.modal.show();
  }

  function doLogin() {
    console.log('Doing login', vm.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      vm.closeLogin();
    }, 1000);
  }
}
