'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'List Users',
      state: 'admin.users',
      type: 'dropdown',
      roles: ['admin', 'agent']
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create User',
      state: 'admin.newuser',
      type: 'dropdown',
      roles: ['admin', 'agent']
    });
  }
]);
