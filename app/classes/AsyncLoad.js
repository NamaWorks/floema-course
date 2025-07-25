import Component from 'classes/Component'

export default class AsyncLoad extends Component {
  constructor ({ element }) {
    super({ element })
    // this.createObserver()

    // this.animateOut()
  }

  createObserver () {
    this.observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.element.src = this.element.getAttribute('data-src')
          this.element.onload = _ => {
            this.element.classList.add('loaded')
          }
        }
      })
    })

    this.observer.observe(this.element)
  }
}
