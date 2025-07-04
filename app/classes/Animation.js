import Component from 'classes/component'

export default class Animation extends Component {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })
    // this.element = element
    this.createObserver()

    this.animateOut()
  }

  createObserver () {
    this.observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('animate in')
          this.animateIn()
        } else {
          console.log('animate out')
          this.animateOut()
        }
      })
    })

    this.observer.observe(this.element)
  }

  animateIn () {}

  animateOut () {}

  onResize () {}
}

// intersection observer is a JS API that lets you know when an object is in viewport
