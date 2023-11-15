export interface SingleImage {
  src: string
}


export interface SingleImageEmits {
  (e: 'change-scale', scale: number): void
}
