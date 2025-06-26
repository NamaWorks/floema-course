require('dotenv').config()

const logger = require('morgan')
const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const path = require('path')
const app = express()
const port = 3000

// middleware
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))

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
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`
  }

  if (doc.type === 'about') {
    return '/about'
  }

  if (doc.type === 'collections') {
    return '/collection'
  }
  // Default to homepage
  return '/'
}

app.use((req, res, next) => {
  res.locals.ctx = {
    endpoints: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver
  }

  res.locals.Link = handleLinkResolver

  res.locals.Numbers = index => {
    return index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : index === 3 ? 'Four' : ''
  }
  // Add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM

  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug') // we define that we are going to render pug files

// const handleRequest = async api => { // we could do something like this for the general requests
//   const meta = await api.getSingle('meta')
//   const preloader = await api.getSingle('preloader')
//   const navigation = await api.getSingle('navigation')

//   return {
//     meta,
//     navigation,
//     preloader
//   }
// }

app.get('/', (req, res) => {
  let apiT

  initApi(req).then(async api => {
    apiT = api
    return api.query(
      Prismic.predicates.any('document.type', ['home', 'meta', 'preloader, collection, navigation'])
    )
  })
    .then(async response => {
      const { results } = response
      const meta = results.find(doc => doc.type === 'meta') || { data: {} }
      // const meta = await apiT.query(Prismic.Predicates.at('document.type', 'meta'))
      // console.log(meta)
      const preloader = await apiT.getSingle('preloader')
      const navigation = await apiT.getSingle('navigation')
      // const { results: home } = await apiT.query(Prismic.Predicates.at('document.type', 'home'))
      const home = await apiT.getSingle('home')
      // const collection = await apiT.getSingle('collection')
      const { results: collection } = await apiT.query(Prismic.Predicates.at('document.type', 'collection'), { // this is the way if we use Prismic.predicates.any('document.type', [])
        fetchLinks: 'product.image' // what we do here is fetching from the type product the image
      })
      res.render('pages/home', {
        home,
        meta,
        preloader,
        collection,
        navigation
      })
    })
})

// Route: /about/
// Fetches both 'about' and 'meta' documents from Prismic CMS.
// Uses .find() to ensure the correct document is assigned to each variable, regardless of order returned by the API.
// If a document is not found, provides a fallback object with an empty data property to prevent template errors.
// Passes both 'about' and 'meta' to the Pug template for rendering.
app.get('/about/', async (req, res) => {
  let apiT
  initApi(req)
    .then((api) => {
      apiT = api
      return api.query(
        Prismic.predicates.any('document.type', ['about', 'meta', 'preloader', 'navigation'])
      )
    })
    .then(async (response) => {
      const { results } = response
      const meta = results.find(doc => doc.type === 'meta') || { data: {} }
      const preloader = results.find(doc => doc.type === 'preloader') || { data: {} }
      const navigation = await apiT.getSingle('navigation')
      const about = results.find(doc => doc.type === 'about') || { data: {} } // this way it returns an object
      // const { results: about } = await apiT.query(Prismic.Predicates.at('document.type', 'about'), { // this way it returns an array
      // fetchLinks: 'about.data.body'
      // })
      res.render('pages/about', {
        about,
        meta,
        preloader,
        navigation
      })
    })
})

app.get('/collection/', async (req, res) => {
  let apiT

  initApi(req)
    .then((api) => {
      apiT = api
      return api.query(
        Prismic.predicates.any('document.type', ['collection', 'meta', 'home'])
      )
    })
    .then(async (response) => {
      const { results } = response
      const meta = results.find(doc => doc.type === 'meta') || { data: {} }
      const preloader = await apiT.getSingle('preloader')
      const { results: home } = await apiT.query(Prismic.Predicates.at('document.type', 'home'))
      const navigation = await apiT.getSingle('navigation')
      const { results: collection } = await apiT.query(Prismic.Predicates.at('document.type', 'collection'), {
        fetchLinks: 'product.image' // what we do here is fetching from the type product the image
      })

      res.render('pages/collection', {
        meta,
        collection,
        home,
        preloader,
        navigation
      })
    })
})

app.get('/detail/:uid', async (req, res) => {
  let apiT

  initApi(req)
    .then((api) => {
      apiT = api
      return api.query(
        Prismic.predicates.any('document.type', ['detail', 'meta'])
      )
    })
    .then(async (response) => {
      const { results } = response
      const meta = results.find(doc => doc.type === 'meta') || { data: {} }
      const preloader = await apiT.getSingle('preloader')
      const navigation = await apiT.getSingle('navigation')
      const product = await apiT.getByUID('product', req.params.uid, {
        fetchLinks: 'collection.title' // we use this for fetching more info about the link
      })

      res.render('pages/detail', {
        meta,
        product,
        preloader,
        navigation
      })
    })
})

app.listen(port, () => {
  console.log(`example app listening at http://localhost:${port}`)
})
