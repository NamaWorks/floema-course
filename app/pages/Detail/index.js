import Page from 'classes/Page'
import Button from '../../classes/Button'

export default class Detail extends Page {
  constructor () {
    super({
      id: 'detail',
      element: '.detail',
      elements: {
        button: '.detail__button',
        navigation: document.querySelector('.navigation'),
        title: '.detail__title'
      }
    })
  }

  create () {
    super.create()

    this.link = new Button({
      element: this.elements.button
    })
  }

  destroy () {
    super.destroy()

    this.link.removeEventListeners()
  }
}
