/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * Create Accounts
   * @param req
   * @param res
   * @returns {Promise<void>}
   * @routes POST /user/create
   */
  create : (req, res) => {
    const params = req.body;
    const usernameChecker = /^[-\w ]+$/;
    const emailChecker = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let tasks, criteria, initialValues, data;

    // Validators
    if (_.isUndefined(params.email))
      return res.badRequest({ status: 400, message: "Invalid Parameter. [email]"});
    if (_.isUndefined(params.username))
      return res.badRequest({ status: 400, message: "Invalid Parameter. [username]"});
    if (_.isUndefined(params.password))
      return res.badRequest({ status: 400, message: "Invalid Parameter. [password]"});

    if (params.username.length > 30)
      return res.badRequest({ status: 400, message: "Username exceed 30 characters." });
    if (params.username.length < 6)
      return res.badRequest({ status: 400, message: "The username must be at least 6 characters." });
    if (!usernameChecker.test(params.username))
      return res.badRequest({ status: 400, message: "Invalid username format" });
    if (!emailChecker.test(params.email))
      return res.badRequest({ status: 400, message: "Invalid email format" });

    // Override variables
    params.role_id = _.isUndefined(params.role_id) ? 1 : params.role_id;

    tasks = {
      save: async (cb) => {
        // Pre-setting variables
        criteria = {or : [{email: params.email}, {username: params.username}]};
        initialValues = _.pick(params, ['email', 'username', 'password', 'role_id']);
        // Execute find query
        data = await Users.find(criteria).intercept((err) => { return cb(err); });
        if (!_.isEmpty(data)) {
          return res.badRequest({ status: 400, message: "User already exist." });
        } else {
          // Execute create query
          data = await Users.create(initialValues).fetch().intercept((err) => { return cb(err); });
          return cb(null, data);
        }
      }
    };

    // Execute tasks
    async.auto(tasks, async (err, results) => {
      if (err) {
        console.log("\033[31m", "USER_CREATE:", JSON.stringify(err), "\033[0m");
        return res.badRequest({
          status: 401,
          err: err,
          message: "Failed creating an account."
        });
      }

      return res.json({
        status: 200,
        message: "Successfully created an account.",
        data: Object.assign(_.omit(results.save, ['password', 'id']), {id: await encryptionHelper('encrypt', results.save.id)})
      });
    });
  },

  /**
   * Update user
   * @route PUT /user/update/:id
   * @param req
   * @param res
   * @returns {never}
   */
  update : (req, res) => {
    const params = req.body;
    let tasks, criteria, initialValues, data;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    tasks = {
      save: async (cb) => {
        // Pre-setting variables
        criteria = {id: req.params.id};
        initialValues = _.omit(params, ["id", "password", "is_logged", "is_deleted"]);
        // Execute update query
        data = await Users.update(criteria, initialValues).fetch().intercept((err) => { return cb(err); });
        if (_.isEmpty(data)) {
          return res.badRequest({ status: 400, message: "User doesn't exist." });
        } else {
          return cb(null, data[0]);
        }
      },
    };

    // Execute tasks
    async.auto(tasks, async (err, results) => {
      if (err) {
        console.log("\033[31m", "USER_UPDATE:", JSON.stringify(err), "\033[0m");
        return res.badRequest({
          status: 401,
          err: err,
          message: "Failed updating an account."
        });
      }

      return res.json({
        status: 200,
        message: "Successfully updated an account.",
        data: Object.assign(_.omit(results.save, ['password', 'id']), {id: await encryptionHelper('encrypt', results.save.id)})
      });
    });
  },

  /**
   * Delete user
   * @route POST /user/delete/:id
   * @param req
   * @param res
   * @returns {never}
   */
  delete : (req, res) => {
    let tasks, criteria, initialValues, data;

    tasks = {
      save: async (cb) => {
        // Pre-setting variables
        criteria = {id: req.params.id};
        initialValues = {is_active: 0, is_deleted: 1};
        // Execute update query
        data = await Users.update(criteria, initialValues).fetch().intercept((err) => { return cb(err); });
        if (_.isEmpty(data)) {
          return res.badRequest({ status: 400, message: "User doesn't exist." });
        } else {
          return cb(null, data[0]);
        }
      },
    };

    // Execute tasks
    async.auto(tasks, async (err, results) => {
      if (err) {
        console.log("\033[31m", "USER_DELETE:", JSON.stringify(err), "\033[0m");
        return res.badRequest({
          status: 401,
          err: err,
          message: "Failed deleting an account."
        });
      }

      return res.json({
        status: 200,
        message: "Successfully deleted an account.",
        data: Object.assign(_.omit(results.save, ['password', 'id']), {id: await encryptionHelper('encrypt', results.save.id)})
      });
    });
  },

  /**
   * Search users
   * @route POST /user/search/
   * @param req
   * @param res
   * @returns {never}
   */
  search : (req, res) => {
    const params = req.body;
    let tasks, query;

    if (_.isUndefined(params))
      return res.badRequest({ err: "Invalid Parameter: [params]" });
    if (_.isEmpty(params))
      return res.badRequest({ err: "Empty Parameter: [params]" });

    tasks = {
      find: async (cb) => {
        // Pre-setting variables
        query = `SELECT id, email, username, role_id, created_at, updated_at, permission_type, is_logged, is_active FROM users WHERE CONCAT(email, username) LIKE "%${params.value}%";`;
        // Execute native query
        await Users
          .getDatastore()
          .sendNativeQuery(query, (err, result) => {
            if (err) return cb(err);
            if (_.isEmpty(result.rows)) return res.json({status: 200, message: "No Data Found."});
            return cb(null, result.rows);
          });
      },
    };

    // Execute tasks
    async.auto(tasks, (err, results) => {
      if (err) {
        console.log("\033[31m", "USER_SEARCH:", JSON.stringify(err), "\033[0m");
        return res.badRequest({
          status: 401,
          err: err,
          message: "Failed search data."
        });
      }

      return res.json({
        status: 200,
        message: "Successfully searched data.",
        data: results.find
      });
    });
  },

  /**
   * Find all users
   * @route GET /user
   * @param req
   * @param res
   * @returns {never}
   */
  findAll : (req, res) => {
    // const params = req.body;
    let tasks, data, criteria;

    tasks = {
      findAll: async (cb) => {
        // Pre-setting variables
        criteria = { select: ["id", "email", "username", "role_id", "created_at", "updated_at", "permission_type", "is_logged", "is_active"]};
        // Execute find query
        data = await Users.find(criteria).intercept((err) => { return cb(err); });
        return cb(null, data);
      },
    };

    // Execute tasks
    async.auto(tasks, (err, results) => {
      if (err) {
        console.log("\033[31m", "USER_FINDALL:", JSON.stringify(err), "\033[0m");
        return res.badRequest({
          status: 401,
          err: err,
          message: "Failed find all data."
        });
      }

      return res.json({
        status: 200,
        message: "Successfully find all data.",
        data: results.findAll
      });
    });
  },

  /**
   * Find user by id
   * @route GET /user/:id
   * @param req
   * @param res
   * @returns {never}
   */
  findById : (req, res) => {
    let tasks, data;

    tasks = {
      findById: async (cb) => {
        // Execute findOne query
        data = await Users.findOne({id: req.params.id}).intercept((err) => { return cb(err); });
        if (data.is_deleted) return cb({error: "User already deleted."});
        return cb(null, data);
      },
    };

    // Execute tasks
    async.auto(tasks, (err, results) => {
      if (err) {
        console.log("\033[31m", "USER_FIND_BY_ID:", JSON.stringify(err), "\033[0m");
        return res.badRequest({
          status: 401,
          err: err,
          message: "Failed to find account."
        });
      }

      return res.json({
        status: 200,
        message: "Successfully find account.",
        data: _.omit(results.findById, ['password', 'is_deleted'])
      });
    });
  },
};
