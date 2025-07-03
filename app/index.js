import Preloader from 'components/preloader'
import each from 'lodash/each'
import About from 'pages/About'
import Collection from 'pages/Collection'
import Detail from 'pages/Detail'
import Home from 'pages/Home'

class App {
  constructor () {
    this.createPreloader()
    this.createContent()
    this.createPages()
    this.addEventListeners()
    this.addLinkListeners()
  }

  createPreloader () {
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  createContent () {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
    // this.template = this.content.dataset.template  =>  this is the same as above, but not supported in some safari versions
  }

  createPages () {
    this.pages = {
      about: new About(),
      collection: new Collection(),
      detail: new Detail(),
      home: new Home()
    }

    this.page = this.pages[this.template]
    this.page.create()
    // this.page.show()
  }

  async onPreloaded () {
    console.log('Preloaded!')
    this.preloader.destroy()
    this.onResize()
    this.page.show()
    this.update()
  }

  async onChange (url) {
    await this.page.hide()

    const request = await window.fetch(url)
    console.log(request)

    if (request.status === 200) {
      const html = await request.text()

      const div = document.createElement('div')

      div.innerHTML = html

      const divContent = div.querySelector('.content')
      this.template = divContent.getAttribute('data-template')

      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.page = this.pages[this.template]
      this.page.create()
      this.page.show()

      this.onResize()

      this.addLinkListeners()

      this.update()
    } else {
      console.log('Error: ')
    }
  }

  onResize () {
    if (this.page && this.page.onResize) {
      this.page.onResize()
    }
  }

  update () {
    // console.warn('update')
    if (this.page && this.page.update) {
      this.page.update()
    }
    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  addEventListeners () {
    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners () {
    const links = document.querySelectorAll('a')
    each(links, link => {
      link.onclick = event => {
        event.preventDefault()
        const { href } = link
        this.onChange(href)
        // console.log(event, href)
      }
    })
  }
}

new App()
