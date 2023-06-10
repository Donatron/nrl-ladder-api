const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.port || 8080

app.use(cors())

const webScrapingRouter = require('./routers/webScrapingRouter')

app.use(webScrapingRouter)

app.listen(PORT, () => {
  console.log(`App listing on port: ${PORT}`)
})