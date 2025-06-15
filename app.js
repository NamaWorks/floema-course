require('dotenv').config()

const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

// connect to API
const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    // req: req
    // req => this way we can use destructuring for easier to read syntax
    req
  })
}

const handleLinkResolver = (doc) => {
  // Define the url depending on the document type
  if (doc.type === 'page') {
    return '/page/' + doc.uid
  } else if (doc.type === 'blog_post') {
    return '/blog/' + doc.uid
  }

  // Default to homepage
  return '/'
}

// middleware
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoints: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver
  }
  // Add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM
  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('pages/home')
})

// Route: /about/
// Fetches both 'about' and 'meta' documents from Prismic CMS.
// Uses .find() to ensure the correct document is assigned to each variable, regardless of order returned by the API.
// If a document is not found, provides a fallback object with an empty data property to prevent template errors.
// Passes both 'about' and 'meta' to the Pug template for rendering.
app.get('/about/', async (req, res) => {
  initApi(req)
    .then((api) => {
      return api.query(
        Prismic.predicates.any('document.type', ['about', 'meta'])
      )
    })
    .then((response) => {
      // response is the response object. Render your views here.
      const { results } = response
      // Find the correct documents by type
      const meta = results.find(doc => doc.type === 'meta') || { data: {} }
      const about = results.find(doc => doc.type === 'about') || { data: {} }
      res.render('pages/about', {
        about,
        meta
      })
    })
})

// app.get('/about', (req, res) => {
//   res.render('pages/about')
// })

app.get('/collections', (req, res) => {
  res.render('pages/collections')
})

app.get('/detail/:uid', (req, res) => {
  res.render('pages/detail')
})

app.listen(port, () => {
  console.log(`example app listening at http://localhost:${port}`)
})
