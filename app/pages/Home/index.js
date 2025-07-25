import Page from 'classes/Page'
import Button from 'classes/Button'

export default class Home extends Page {
  constructor () {
    super({
      id: 'home',
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
        navigation: document.querySelector('.navigation'),
        button: '.home__link'
      }
    })
  }

  create () {
    super.create() // with this we call the super (the class we are extending) function create()

    this.link = new Button({
      element: this.elements.link
    })
  }

  destroy () {
    super.destroy()

    this.link.removeEventListeners()
  }
}
