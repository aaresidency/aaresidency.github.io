/** Small (640 px) version of a gallery image, for thumbnails and strips; the full-size file is for lightboxes and hero areas. */
export const thumb = (src: string) => src.replace(/\.webp$/, '-sm.webp')
