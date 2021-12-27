import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import fastifyCors from 'fastify-cors'
import { join } from 'path'

const app = fastify()
const PORT = process.env.PORT || 3000

//---------- middleware -----------------
app.register(fastifyStatic, {
  root: join(process.cwd(), 'public'),
})
app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['X-Requested-With', 'content-type'],
  credentials: true,
})

//----------------------------------------------------------------------------
let user_cordinate = {}
// clear no playing users
setInterval(() => {
  for (const userid in user_cordinate) {
    if (Object.hasOwnProperty.call(user_cordinate, userid)) {
      const obj = user_cordinate[userid]
      if (obj['kill']) {
        delete user_cordinate[userid]
      }
    }
  }
}, 15000)
//---------------------------------------------------

app.get('/', (req, res) => {
  return res.sendFile('index.html')
})

app.post('/:userID', (req, res) => {
  try {
    let { userID } = req.params
    //my news
    user_cordinate[userID] = req.body

    //all news
    return res
      .code(200)
      .header('Content-Type', 'application/json')
      .send(user_cordinate)
  } catch (error) {
    res
      .code(200)
      .header('Content-Type', 'application/json')
      .send({ ERROR: 'SERVER not USER' })
    console.log(error)
  }
})

app.listen(PORT, '0.0.0.0', (e, a) => {
  if (e) return console.log(e)
  console.log(a)
})
