import gsap from 'gsap'

import Component from 'classes/Component'

export default class Button extends Component {
  constructor ({ element }) {
    super({ element })

    if (!element) {
      console.warn('Button: No element provided')
      return
    }

    this.path = element.querySelector('path:last-child')
    this.pathLength = this.path ? this.path.getTotalLength() : 0

    this.timeline = gsap.timeline({ paused: true })

    if (this.path) {
      this.timeline.fromTo(this.path, {
        strokeDashoffset: this.pathLength,
        strokeDasharray: `${this.pathLength} ${this.pathLength}`
      }, {
        strokeDashoffset: 0,
        strokeDasharray: `${this.pathLength} ${this.pathLength}`
      })
    }
  }

  onMouseEnter () {
    console.log('enter')
    this.timeline.play()
  }

  onMouseLeave () {
    console.log('leave')
    this.timeline.reverse()
  }

  addEventListeners () {
    if (!this.element) return

    this.onMouseEnterEvent = this.onMouseEnter.bind(this)
    this.onMouseLeaveEvent = this.onMouseLeave.bind(this)
    this.element.addEventListener('mouseenter', this.onMouseEnterEvent)
    this.element.addEventListener('mouseleave', this.onMouseLeaveEvent)
    this.element.addEventListener('click', this.onClick)
  }

  removeEventListeners () {
    this.onMouseLeaveEvent = this.onMouseEnter.bind(this)
    this.onMouseLeaveEvent = this.onMouseEnter.bind(this)
    this.element.addEventListener('mouseenter', this.onMouseEnterEvent)
    this.element.addEventListener('mouseleave', this.onMouseLeaveEvent)
  }
}
