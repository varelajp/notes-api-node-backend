// const http = require('http');
const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')

app.use(cors())
app.use(express.json())
app.use(logger)

let notes = [
  {
    id: '1',
    content: 'Me tengo que suscribir a @midudev en YouTube y Twitch.',
    date: '2019-05-30T17:30:31.0982',
    important: true
  },
  {
    id: '2',
    content: 'Tengo que estudiar las clases del FullStack Bootcamp.',
    date: '2019-05-30T18:39:34.0912',
    important: false
  },
  {
    id: '3',
    content: 'Repasar los retos de JS de midudev.',
    date: '2019-05-30T17:20:14.2982',
    important: true
  }
]
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Context-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  // console.log({id, note});
  if (note) {
    response.json(note)
  } else {
    // response.status(404).send() // before Express version 4
    // response.status(404).end() // from Express version 4 - No message
    // response.status(404).send('Not Found') // from Express version 4 - Your message
    response.sendStatus(404) // from Express version 4 - Automatic 'Not Found' message
  }
})
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)
  response.sendStatus(204)
})
app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const MaxId = Math.max(...ids)
  const newNote = {
    id: MaxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  // notes = [...notes, newNote];
  notes = notes.concat(newNote)

  response.status(201).json(newNote)
})

app.use((request, response) => {
  console.log(`Path ${request.path} not found. Error 404.`)
  response.status(404).json({
    error: 'Not Found'
  })
})

// app.listen(PORT);
// console.log(`Server running on port ${PORT}`);
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
