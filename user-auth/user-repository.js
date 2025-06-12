import DBLocal from 'db-local';
const { Schema } = new DBLocal({path: './db'});

const User = Schema('User', {
  _id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export class UserRepository {
  static create ({username, password}) {}
  static login ({username, password}) {}
  static register ({username, password}) {}
  static logout ({username}) {}
  static getProfile ({username}) {}
}
