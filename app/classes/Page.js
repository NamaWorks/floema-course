import normalizeWheel from 'normalize-wheel'
import Prefix from 'prefix'

import each from 'lodash/each'
import map from 'lodash/map'

import Label from 'animations/Label'
import Paragraph from 'animations/Paragraph'
import Highlight from 'animations/Highlight'
import Title from 'animations/Title'

import Preloader from 'classes/AsyncLoad'
import gsap from 'gsap'

import { ColorsManager } from 'classes/Colors'

export default class Page {
  constructor ({
    element,
    elements = {},
    id
  }) {
    this.selector = element
    this.selectorChildren = {
      ...elements,
      animationsTitles: '[data-animation="title"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsHighlights: '[data-animation="highlight"]',
      animationsLabels: '[data-animation="label"]',
      preloaders: '[data-src]'
    }

    this.id = id

    this.transformPrefix = Prefix('transform')
    // console.log(this.transformPrefix)
  }

  create () {
    this.element = document.querySelector(this.selector)
    this.elements = {}

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0
    }

    this.onMouseWheelEvent = this.onMouseWheel.bind(this)

    // Iterate over selectorChildren object using lodash's each
    each(this.selectorChildren, (entry, key) => {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        this.elements[key] = entry
      } else {
        this.elements[key] = document.querySelectorAll(entry)
      }
    })

    this.createAnimations()
    this.createPreloader()
  }

  createAnimations () {
    this.animations = []

    this.animationsTitles = map(this.elements.animationsTitles, element => {
      const title = new Title({ element })
      // Automatically trigger animation if a method exists
      if (typeof title.animateIn === 'function') {
        title.animateIn()
      } else if (typeof title.show === 'function') {
        title.show()
      }
      return title
    })

    this.animations.push(...this.animationsTitles)

    this.animationsHighlights = map(this.elements.animationsHighlights, element => {
      const title = new Highlight({ element })
      // Automatically trigger animation if a method exists
      if (typeof title.animateIn === 'function') {
        title.animateIn()
      } else if (typeof title.show === 'function') {
        title.show()
      }
      return title
    })

    this.animations.push(...this.animationsHighlights)

    this.animationsParagraphs = map(this.elements.animationsParagraphs, element => {
      const title = new Paragraph({ element })
      // Automatically trigger animation if a method exists
      if (typeof title.animateIn === 'function') {
        title.animateIn()
      } else if (typeof title.show === 'function') {
        title.show()
      }
      return title
    })

    this.animations.push(...this.animationsParagraphs)

    this.animationsLabels = map(this.elements.animationsLabels, element => {
      const title = new Label({ element })
      // Automatically trigger animation if a method exists
      if (typeof title.animateIn === 'function') {
        title.animateIn()
      } else if (typeof title.show === 'function') {
        title.show()
      }
      return title
    })

    this.animations.push(...this.animationsLabels)
  }

  createPreloader () {
    this.preloaders = map(this.elements.preloaders, element => {
      return new Preloader({ element })
    })
  }

  show () {
    return new Promise(resolve => {
      ColorsManager.change({
        backgroundColor: this.element.getAttribute('data-background'),
        color: this.element.getAttribute('data-color')

      })
      this.animationIn = gsap.timeline()

      // gsap.fromTo(this.element, {
      // gsap.animationIn.fromTo(this.element, {
      gsap.fromTo(this.element, {
        autoAlpha: 0,
        delay: 0,
        duration: 4,
        ease: 'sine'
        // onComplete: resolve
      }, {
        autoAlpha: 1,
        delay: 0,
        duration: 4,
        ease: 'sine'
        // onComplete: resolve
      })

      this.animationIn.call(() => {
        this.addEventListeners()

        resolve()
      })
    })
  }

  hide () {
    return new Promise(resolve => {
      // this.removeEventListeners()
      this.destroy()

      // this.animationIn.gsap.timeline()
      // this.gsap.timeline()

      gsap.to(this.element, {
        autoAlpha: 0,
        delay: 0,
        duration: 1,
        ease: 'sine',
        onComplete: resolve
      })
    })
  }

  onMouseWheel (event) {
    const { pixelY } = normalizeWheel(event)
    // console.log(pixelY)

    this.scroll.target += pixelY
  }

  onResize () {
    // console.log(this.elements.wrapper[0].clientHeight)

    if (this.scroll.current < 0.1) {
      this.scroll.current = 0
    }

    this.scroll.limit = this.elements.wrapper[0].clientHeight - window.innerHeight

    each(this.animations, animation => animation.onResize())
  }

  update () {
    this.scroll.current = gsap.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)
    this.scroll.current = gsap.utils.clamp(0, this.scroll.limit, this.scroll.current)
    this.scroll.target = gsap.utils.clamp(0, this.scroll.limit, this.scroll.target)

    if (this.elements.wrapper) {
      this.elements.wrapper[0].style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`
    }
  }

  addEventListeners () {
    window.addEventListener('mousewheel', this.onMouseWheelEvent)
  }

  removeEventListeners () {
    window.removeEventListener('mousewheel', this.onMouseWheelEvent)
  }

  destroy () {
  this.removeEventListeners()
  }
}
