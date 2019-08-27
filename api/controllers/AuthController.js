/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * Login Accounts
   * @param req
   * @param res
   * @routes POST /user/login
   * @returns {never}
   */
  login: (req, res) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    let params = req.body;
    let tasks;

    // Validators
    if (_.isUndefined(params.username))  return res.badRequest("Invalid Credentials.");

    tasks = {
      // Check user if existing
      checkUser: async (cb) => {
        if (_.isEmpty(params.username))  return cb(null, {error: true, message: "Username is required."});
        if (_.isEmpty(params.password))  return cb(null, {error: true, message: "Password is required."});

        let userInfo = await Users.findOne({ username: params.username }).intercept((err) => { return cb(err); });
        // Account checker
        if (userInfo) {
          bcrypt.compare(params.password, userInfo.password, async (err, match) => {
            if (err || !match) return cb(null, {error: true, message: "Invalid Credentials."});
            return cb(null, {error: false, data: userInfo});
          });
        } else {
          return cb(null, {error: true, message: "User not exist."});
        }
      },
      // Update database status
      updateLogStatus: ["checkUser", async (cb, result) => {
        const user = result.checkUser;
        let responseData = await Users.update({ id: user.id }, { is_logged: 1 }).fetch().intercept((err) => { return next(err); });
        let token = generateToken(user.id);
        return cb(null, { token, user: responseData[0] });
      }]
    };

    // Execute tasks
    async.auto(tasks, async (err, results) => {
      if (err) { console.error(err); return res.badRequest(err); }
      sails.log("AuthController@login - [ID]:%s [User]:%s [IP]%s", results.updateLogStatus.user.id, results.updateLogStatus.user.username, ip);

      if (results.checkUser.error) {
        return res.ok({
          status: 200,
          message: results.checkUser.message,
          result: false
        });
      }

      return res.ok({
        status: 200,
        message: "User successfully signed in.",
        result: {
          token: results.updateLogStatus.token,
          data: Object.assign(_.omit(results.updateLogStatus.user, ['password', 'id']), {id: await encryptionHelper('encrypt', results.updateLogStatus.user.id)})
        }
      });
    });
  },

  /**
   * Logout Accounts
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /user/logout
   */
  logout: async (req, res) => {
    let ip = req.headers["x-forwarded-for"] || req.ip;
    var token = req.body.token; // Value needs to be changed, so keep it to `var`

    const tasks = {
      checkCredentials: async (cb) => {
        if (token) {
          let user = await JwtService.verify(token);
          if (!user) return cb('Already logged out.')
          return cb(null, user)
        }
      },
      updateLogStatus: ["checkCredentials", async (cb, result) => {
        let userData = await Users.update({id: result.checkCredentials.id}, {is_logged: 0})
          .intercept((err) => {
            return cb(err);
          })
          .fetch();
        sails.log("AuthController@logout - [ID]:%s [User]:%s [IP]%s", userData[0].id, userData[0].username, ip)
        return cb(null, null);
      }]
    };

    async.auto(tasks, (err, results) => {
      if (err) return res.badRequest(err);

      return res.ok({
        status: 200,
        message: "Successfully logged out.",
        result: true
      });
    });
  },

};

function generateToken(userId) {
  return JwtService.issue({id: userId});
}
