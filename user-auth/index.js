import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  const token = req.cookies['access-token'];
  req.session = { user: null };

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY);
    req.session.user = data
  } catch {}

  next();
})

app.get('/', (req, res) => {
  const { user } = req.session;
  res.render('index', user);
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      const userId = await UserRepository.login({ username, password });
      const token = jwt.sign(
        { id: userId._id, username: userId.username }, 
        SECRET_JWT_KEY, 
        { expiresIn: '1h' }
      );
      res
        .cookie('access-token', token, { 
          httpOnly: true, // la cookie no es accesible desde JavaScript del lado del cliente 
          secure: process.env.NODE_ENV === 'production', // solo se envía a través de HTTPS en producción
          sameSite: 'Strict', // la cookie solo se envía en solicitudes del mismo sitio
          maxAge: 3600000 // 1 hora
        })
        .send({ userId, token });
  } catch (error) {
      res.status(401).send(error.message);
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
      const userId = await UserRepository.create({ username, password });
      res.send({ id: userId });
  } catch (error) {
      res.status(400).send(error.message);
  }
})
app.post('/logout', (req, res) => {
  res.clearCookie('access-token');
  req.session.user = null;
  res.render('index');
})

app.get('/protected', (req, res) => {
  const { user } = req.session;
    if (!user) {
      return res.status(403).send('Unauthorized');
    }
    res.render('protected', user);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
