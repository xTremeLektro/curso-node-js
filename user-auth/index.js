import express from 'express'
import { PORT } from './config.js'

const app = express()

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.post('/login', (req, res) => {
    res.json({
        message: 'Login endpoint is not implemented yet',
        status: 'error'
    })
})
app.post('/register', (req, res) => {
    res.json({
        message: 'Register endpoint is not implemented yet',
        status: 'error'
    })
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
