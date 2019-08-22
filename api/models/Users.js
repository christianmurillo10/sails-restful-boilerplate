/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "users",
  primaryKey: "id",
  attributes: {
    id: {
      type: "number",
      autoIncrement: true
    },
    email: {
      type: "string",
      unique: true,
      required: true,
      isEmail: true
    },
    username: {
      type: "string",
      isNotEmptyString: true,
      columnName: "username",
      required: true,
      maxLength: 30,
      unique: true
    },
    password: {
      type: "string",
      isNotEmptyString: true,
      required: true
    },
    role_id: {
      type: "number",
      required: true
    },
    created_at: {
      type: "ref",
      columnType: "datetime",
      columnName: "created_at"
    },
    updated_at: {
      type: "ref",
      columnType: "datetime",
      columnName: "updated_at"
    },
    permission_type: {
      type: "number",
      allowNull: true,
      defaultsTo: 1
    },
    is_logged: {
      type: "number",
      allowNull: true,
      defaultsTo: 0
    },
    is_active: {
      type: "number",
      allowNull: true,
      defaultsTo: 1
    },
    is_deleted: {
      type: "number",
      allowNull: true,
      defaultsTo: 0
    }
  },
  beforeCreate: (values, next) => {
    values.created_at = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    bcrypt.hash(values.password, 10, (err, hash) => {
      if (err) return next(err);
      values.password = hash;
      next();
    });
  }
};
