import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()

app.set('view engine', 'ejs')
app.use(express.json())

app.get('/', (req, res) => {
  res.render('example', { name: 'User Auth Example' })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      const userId = await UserRepository.login({ username, password });
      res.send({ id: userId });
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
  res.json({
      message: 'Logout endpoint is not implemented yet',
      status: 'error'
  })
})

app.get('/protected', (req, res) => {
  res.json({
      message: 'Protected route is not implemented yet',
      status: 'error'
  })
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
