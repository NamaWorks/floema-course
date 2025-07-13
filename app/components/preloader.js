import gsap from 'gsap'
import each from 'lodash/each'
import Component from 'classes/Component'
import { split } from 'utils/text'

export default class Preloader extends Component {
  constructor () {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text',
        images: document.querySelectorAll('img')
      }
    })

    split({
      element: this.elements.title[0],
      // expression: '<br>'
      expression: ' '
    })

    split({
      element: this.elements.title[0],
      // expression: '<br>'
      expression: ' '
    })

    this.elements.titleSpans = this.elements.title[0].querySelectorAll('span span')

    // console.log(this.elements.titleSpans)

    this.length = 0

    this.createLoader()
  }

  createLoader () {
    each(this.elements.images, element => {
      element.onload = () => this.onAssetLoaded()
      element.src = element.getAttribute('data-src')
    })
  }

  onAssetLoaded (image) {
    this.length += 1

    const percent = this.length / this.elements.images.length

    this.elements.numberText[0].innerHTML = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      this.onLoaded()
    }
  }

  onLoaded () {
    return new Promise(resolve => {
      this.animateOut = gsap.timeline({
        delay: 2
      })

      this.animateOut.to(this.elements.titleSpans, {
        // autoAlpha: 0,
        duration: 1.5,
        y: 100,
        stagger: 0.02,
        ease: 'expo.out'
      })

      this.animateOut.to(this.elements.numberText[0], {
        // autoAlpha: 0,
        duration: 1.5,
        y: 100,
        stagger: 0.02,
        ease: 'expo.out'
      }, '-=1.4')

      this.animateOut.to(this.element, {
        // autoAlpha: 0,
        duration: 2,
        ease: 'expo.out',
        scaleY: 0,
        transformOrigin: '100% 100%'
      }, '-=1')

      this.animateOut.call(_ => {
        this.emit('completed')
      })
    })
  }

  destroy () {
    this.element.parentNode.removeChild(this.element)
  }
}
