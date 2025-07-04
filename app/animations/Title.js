import gsap from 'gsap'
import Animation from 'classes/Animation'

export default class Title extends Animation {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })
  }

  animateIn () {
    gsap.fromTo(this.element, {
      autoAlpha: 0
    }, {
      autoAlpha: 1,
      duration: 1.5,
      delay: 2
    })
  }

  animateOut () {
    gsap.set(this.element, {
      autoAlpha: 0
    })
  }
}
