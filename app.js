// app setup
const express = require('express')
const path = require('path')
const app = express()

// statics
const assetsPath = path.join(__dirname, "public")
app.use(express.static(assetsPath))

// routers
const indexRouter = require('./routes/indexRoutes')

// templating
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// parse form data correctly
app.use(express.urlencoded({ extended: true }))

// index routes
app.use('/', indexRouter)

app.listen(3000, () => console.log(`server listening on port 3000!`));
