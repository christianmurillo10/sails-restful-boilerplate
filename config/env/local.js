module.exports = {
  /**************************************************************************
   *                                                                         *
   * Tell Sails what database(s) it should use in production.                *
   *                                                                         *
   * (https://sailsjs.com/config/datastores)                                 *
   *                                                                         *
   **************************************************************************/
  datastores: {
    default: {
      adapter: "sails-mysql",
      url: "mysql://root:@localhost:3306/sails_restful_mysql_live"
    }
  },
  models: {
    migrate: "safe"
  },
  blueprints: {
    shortcuts: false
  },
  security: {
    cors: {
      headers: 'Content-Type, Authorization'
      // allowOrigins: [
      //   'https://example.com',
      // ]
    },
    jwtSecret: "fGeyJpZCI6NCwiaWF0IjoxNDk0ODY3NDQ0LCJleHAiOjE0OTQ4NzgyNDR9",
    encryptSecret: "9RDNygzN4QTO0EjOiAHelJCL0QDN3YDO0kDNxojI0FWaiwCN6ICZpJyeGf"
  },
  session: {
    // adapter: '@sailshq/connect-redis',
    // url: 'redis://user:password@localhost:6379/databasenumber',
    cookie: {
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  },
  sockets: {
    // adapter: '@sailshq/socket.io-redis',
    // url: 'redis://user:password@bigsquid.redistogo.com:9562/databasenumber',
    //--------------------------------------------------------------------------
  },
  log: {
    level: "debug"
  },
  http: {
    cache: 365.25 * 24 * 60 * 60 * 1000 // One year
    // trustProxy: true,
    // cache: {
    //   prefix: "cache:",
    //   ttl: 7200,
    //   adapter: "redis",
    //   host: "localhost",
    //   password: "",
    //   port: 6379,
    //   db: 6
    // }
  },
  port: 8002,
  // ssl: undefined,
  custom: {
    baseUrl: "https://example.com",
    internalEmailAddress: "support@example.com"
  },
  policies: {
    "*": ["isAuthorized"], // Everything resctricted here
    AuthController: {
      login: true // We dont need authorization here, allowing public access
    },
    // UserController: {
    //   create: true,
    //   update: true,
    //   findAll: true,
    //   findById: true
    // },
  }
};
