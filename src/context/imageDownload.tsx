import { ReactNode, createContext, useRef, MutableRefObject } from 'react'
import domtoimage from 'dom-to-image'
// 首先定义Context的类型
interface ImageDownloadContextProps {
  imageContainerRef: any // 适当地改变类型以匹配`useRef`的返回类型
  handleDownloadImage: (type: 'JPG' | 'PNG' | 'SVG') => void // 或者具有更详细类型的函数签名
}

// 使用断言来定义初始值，确保类型正确
export const ImageDownloadContext = createContext<ImageDownloadContextProps>({
  imageContainerRef: {} as MutableRefObject<HTMLDivElement>, // 使用类型断言确保初始值类型正确
  handleDownloadImage: () => {}, // 提供一个noop(无操作)函数作为初始值
})

export const ImageDownloadProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const imageContainerRef = useRef<HTMLDivElement>(null)

  async function handleDownloadImage(type: 'JPG' | 'PNG' | 'SVG') {
    const node = imageContainerRef.current

    if (node) {
      try {
        let dataUrl
        switch (type) {
          case 'JPG':
            dataUrl = await domtoimage.toJpeg(node, {
              width: node.clientWidth * 2,
              height: node.clientHeight * 2,
              style: {
                transform: 'scale(2)',
                transformOrigin: 'top left',
              },
              quality: 1.0,
            })
            break
          case 'PNG':
            dataUrl = await domtoimage.toPng(node, {
              width: node.clientWidth * 2,
              height: node.clientHeight * 2,
              style: {
                transform: 'scale(2)',
                transformOrigin: 'top left',
              },
              quality: 1.0,
            })
            break
          case 'SVG':
            dataUrl = await domtoimage.toSvg(node)
            break
          default:
            return
        }

        const link = document.createElement('a')
        link.download = `image.${type.toLowerCase()}`
        link.href = dataUrl
        link.click()
      } catch (err) {
        console.error('Something went wrong while downloading image', err)
      }
    }
  }

  return (
    <ImageDownloadContext.Provider
      value={{ imageContainerRef, handleDownloadImage }}>
      {children}
    </ImageDownloadContext.Provider>
  )
}
