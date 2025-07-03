import Page from 'classes/Page'

export default class Collection extends Page {
  constructor () {
    super({
      id: 'collection',
      element: '.collection',
      elements: {
        navigation: document.querySelector('.navigation'),
        title: '.collection__title'
      }
    })
    // super.create() // with this we call the super (the class we are extending) function create()
  }
}
