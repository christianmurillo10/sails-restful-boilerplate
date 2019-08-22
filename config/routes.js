/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  'POST /user/login': {
    cors: {
      allowOrigins: '*'
    },
    action: 'login',
    controller: 'AuthController',
  },

  'POST /user/logout': {
    cors: {
      allowOrigins: '*'
    },
    action: 'logout',
    controller: 'AuthController',
  },

  'POST /user/create': {
    cors: {
      allowOrigins: '*'
    },
    action: 'create',
    controller: 'UserController'
  },

  'PUT /user/update/:id': {
    cors: {
      allowOrigins: '*'
    },
    action: 'update',
    controller: 'UserController'
  },

  'POST /user/delete/:id': {
    cors: {
      allowOrigins: '*'
    },
    action: 'delete',
    controller: 'UserController'
  },

  'POST /user/search': {
    cors: {
      allowOrigins: '*'
    },
    action: 'search',
    controller: 'UserController'
  },

  'GET /user': {
    cors: {
      allowOrigins: '*'
    },
    action: 'findAll',
    controller: 'UserController'
  },

  'GET /user/:id': {
    cors: {
      allowOrigins: '*'
    },
    action: 'findById',
    controller: 'UserController'
  },
};
