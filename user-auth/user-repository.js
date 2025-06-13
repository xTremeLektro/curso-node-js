import DBLocal from 'db-local';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './config.js';

const { Schema } = new DBLocal({path: './db'});

const User = Schema('User', {
  _id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export class UserRepository {
  static async create ({username, password}) {
    Validation.validateUsername(username);
    Validation.validatePassword(password);

    // Asegurar que el username no exista
    const existingUser = User.findOne({ username });
    if (existingUser) throw new Error('El username ya está en uso');

    // Crear el usuario
    const userId = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    // const user = new User({ _id: userId, username, password: hashedPassword });
    // await user.save();
    
    User.create({
      _id: userId,
      username,
      password: hashedPassword
    }).save();

    return userId;
  }

  static async login ({username, password}) {
    Validation.validateUsername(username);
    Validation.validatePassword(password);

    // Buscar el usuario por username
    const user = await User.findOne({ username });
    if (!user) throw new Error('Usuario no encontrado');

    // Verificar la contraseña
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Contraseña incorrecta');

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  static register ({username, password}) {}

  static logout ({username}) {}

  static getProfile ({username}) {}

}

class Validation {
  static validateUsername(username) {
    if (typeof username !== 'string') throw new Error('Faltan datos');
    if (username.length < 3) throw new Error('El username debe tener al menos 3 caracteres');
  }

  static validatePassword(password) {
    if (typeof password !== 'string') throw new Error('Faltan datos');
    if (password.length < 6) throw new Error('El password debe tener al menos 6 caracteres');
  } 
}