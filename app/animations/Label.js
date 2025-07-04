import gsap from 'gsap'
import Animation from 'classes/Animation'
import { split, calculate } from 'utils/text'

export default class Label extends Animation {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    split({
      element: this.element,
      append: true
    })

    split({
      element: this.element,
      append: true
    })

    this.elementLinesSpans = this.element.querySelectorAll('span span')
  }

  animateIn () {
    this.timelineIn = gsap.timeline({
      delay: 0.5
    })

    this.timelineIn.set(this.element, {
      autoAlpha: 1
    })

    this.timelineIn.fromTo(this.elementsLines, {
      autoAlpha: 0,
      y: '100%'
    }, {
      autoAlpha: 1,
      delay: 0.25,
      duration: 0.5,
      // autoAlpha: 1,
      stagger: {
        amount: 0.15,
        ease: 'expo.out',
        axis: 'x'
      },
      y: '0%'
    })
  }

  animateOut () {
    gsap.set(this.element, {
      autoAlpha: 0
    })
  }

  onResize () {
    this.elementsLines = calculate(this.elementLinesSpans)
  }
}
