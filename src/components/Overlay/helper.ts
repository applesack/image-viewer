export function calcDomSize(dom: HTMLElement) {
  console.log(dom)
  console.log(dom.getBoundingClientRect())
  console.log(dom.clientWidth)
  console.log(dom.offsetWidth)
  console.log(dom.scrollWidth)
  return {
    width: dom.offsetWidth,
    height: dom.offsetHeight
  }
}
