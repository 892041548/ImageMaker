import {
  createContext,
  useEffect,
  useState,
  KeyboardEvent,
  ReactNode,
} from 'react'
import ImageItem from '@/page/left/ImageItem'

import {
  BottomLeftIcon,
  BottomRightIcon,
  MiddleIcon,
  TopLeftIcon,
  ToprightIcon,
} from '@/page/right/posotion-logo'

export const ImgContext = createContext({
  imgList: [],
  setImgList: () => {},
} as any)

export default function ImgContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [imageList, setImageList] = useState<ImageItem[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  // setImgInfo在left组件中存储图片数据，imgInfo给center组件传递图片数据
  const [imgInfo, setImgInfo] = useState<any>({})
  // 用户上传图片的state
  const [uploadCurrentImage, setUploadCurrentImage] = useState<any>(null)
  // 用于判断是否是上传图片，还是默认通过API获取的图片
  const [isUpload, setIsUpload] = useState(false)

  // 用于用户输入的AI图片描述
  const [aiValue, setAiValue] = useState('')
  // 用于AI生成图片的url
  const [aiResult, setAiResult] = useState<any>(null)
  // loading
  const [loadingAIImage, setLoadingAIImage] = useState(false)

  // 图片比例
  const [proportionValue, setProportionValue] = useState('aspect-[16/9]')

  // 图片形状（圆角或者方形）
  const [isCircle, setIsCircle] = useState(true)

  // 作者标签值
  const [authorValue, setAuthorValue] = useState('@ImageMaker')

  // 作者水印位置
  const [authorPosition, setAuthorPosition] = useState<any>('')
  // 标题&文案
  const [titleValue, setTitleValue] = useState('')

  // 字体
  const [fontValue, setFontValue] = useState('font-dingtalk')

  // 字体大小
  const [fontSizeValue, setFontSizeValue] = useState('')

  // 设置遮罩层颜色
  const [hexColor, setHexColor] = useState('#3F51B5')

  // 设置遮罩颜色透明度
  const [opacityValue, setOpacityValue] = useState(0.1)

  // 设置白板工具（铅笔或橡皮擦）
  const [boardTool, setBoardTool] = useState('pen')

  // 设置铅笔大小
  const [penSize, setPenSize] = useState<number>(2)

  // 设置铅笔颜色
  const [board_pen_color, setBoardPenColor] = useState('#e23922')


  const [imageToText, setImageToText] = useState<any>(null)
  const [uploadExplainImageUrl, setUploadExplainImageUrl] = useState<any>(null)

  const [zhTitleValue, setZhTitleValue] = useState('')
  const [translateButtonLoading, setTranslateButtonLoading] = useState<any>(null)

  const [shouldTranslateFlag, setShouldTranslateFlag] = useState(false)

  

  // 获取图片
  async function getImage(searchText: string = '') {
    try {
      setIsLoading(true)
      const accessKey = import.meta.env.VITE_PUBLIC_UNSPLASH_API_KEY
      const endpoint =
        searchText.length > 0
          ? `https://api.unsplash.com/search/photos`
          : `https://api.unsplash.com/photos`
      const queryParam = searchText
        ? `&query=${encodeURIComponent(searchText)}`
        : ''
      const res = await fetch(
        `${endpoint}?per_page=30${queryParam}&client_id=${accessKey}`
      )
      const data = await res.json()

      if (data && data.results) {
        // 如果是使用搜索API，结果会在data.results中
        setImageList(data.results)
      } else {
        setImageList(data) // 直接访问 Unsplash collections/photos 数据在顶层
      }
      // console.log(imageList,'33')
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
      setSearchValue('')
    }
  }

  useEffect(() => {
    getImage()
  }, [])

  // 按下回车事件
  function onSearchKeyDown(e: KeyboardEvent<HTMLInputElement> | KeyboardEvent) {
    if (e.key === 'Enter') {
      getImage(searchValue)
    }
  }

  // 上传图片
  function uploadImage(file: any) {
    try {
      if (file) {
        const newImageUrl = URL.createObjectURL(file) // 简易本地示例
        setUploadCurrentImage({ urls: { regular: newImageUrl } }) // 设置为能够展示格式
        setIsUpload(true)
      }
    } catch (e) {
      console.error(e)
    }
  }

  function uploadExplainImage(file: any) {
    try {
      if (file) {
        const newImageUrl = URL.createObjectURL(file) // 简易本地示例
        setUploadExplainImageUrl(newImageUrl) // 设置为能够展示格式
        // setIsUpload(true)
        handleReceiveImage(file)
      }
    } catch (e) {
      console.error(e)
    }
  }

  // 选择图片比例
  function handleProportionValue(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value)

    setProportionValue(e.target.value)
  }

  // 选择形状
  function handleIsCircle() {
    setIsCircle(!isCircle)
  }

  // 切换字体
  function handleChangeFont(e: React.ChangeEvent<HTMLSelectElement>) {
    setFontValue(e.target.value)
  }

  // 设置字体大小
  function handleChangeFontSize(value: string) {
    setFontSizeValue(value)
  }

  // 作者水印位置：左上、左下、中间、右下、右上
  const authorPositionList = [
    {
      id: 'bottom-left',
      position: <BottomLeftIcon />,
      value: {
        bottom: '0',
        padding: '0.75rem',
        position: 'absolute',
      },
    },
    {
      id: 'bottom-right',
      position: <BottomRightIcon />,
      value: {
        bottom: '0',
        right: '0',
        padding: '0.75rem',
        position: 'absolute',
      },
    },
    {
      id: 'middle',
      position: <MiddleIcon />,
      value: {
        top: '60%',
        left: '50%',
        position: 'absolute',
      },
    },
    {
      id: 'top-left',
      position: <TopLeftIcon />,
      value: {
        top: '0',
        padding: '0.75rem',
        position: 'absolute',
      },
    },
    {
      id: 'top-right',
      position: <ToprightIcon />,
      value: {
        top: '0',
        right: '0',
        padding: '0.75rem',
        position: 'absolute',
      },
    },
  ]

  // 设置作者水印位置
  function handleAuthorPosition(e: any) {
    // console.log(e);
    const matchItem = authorPositionList.find((item) => item.id === e)

    if (matchItem) {
      setAuthorPosition(matchItem.value)
    }
    // setAuthorPosition(value)
  }

  // 选择遮罩颜色
  function handleChangeCompleteColor(color: any) {
    setHexColor(color.hex.toUpperCase())
  }

  // 设置铅笔大小
  function handlePenSize(val: Set<any>) {
    let newArr = Array.from(val)
    setPenSize(newArr[0])
  }

  // 设置铅笔颜色
  function handleChangeBoardPenColor(color: any) {
    setBoardPenColor(color.hex.toUpperCase())
  }

  // 发送请求
  async function query(data: any) {
    const accessToken = import.meta.env.VITE_PUBLIC_HUGGINGFACE_API_KEY
    const response = await fetch(
      // 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      'https://api-inference.huggingface.co/models/prompthero/openjourney-v4',
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
    const result = await response.blob()
    return result
  }


  // 生成AI图片
  function handleGenerateAIImage() {
    try {
      setLoadingAIImage(true)
      const data = {
        inputs: aiValue,
      }
      query(data).then((res) => {
        const url = URL.createObjectURL(res)
        setAiResult(url)
        setLoadingAIImage(false)
      })
    } catch (e) {
      console.log(e)
    }
  }

  // 提交AI图片到center组件
  function handleSubmitAIImage() {
    console.log('111', aiResult)

    setImgInfo({
      urls: {
        regular: aiResult,
      },
    })
  }


  // 提交本地图片到center组件
  function handleSubmitExplainImage() {
    console.log('222', uploadExplainImageUrl)
    setTitleValue(imageToText || '')
    setImgInfo({
      urls: {
        regular: uploadExplainImageUrl,
      },
    })
  }

  // AI识别图片
  // 发送请求
  async function queryByBuffer(data: any) {
    const accessToken = import.meta.env.VITE_PUBLIC_HUGGINGFACE_API_KEY
    const response = await fetch(
      'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large', // 更准些
      // 'https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning',
      
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        method: 'POST',
        body: data,
      }
    )
    const result = await response.json()
    return result
  }


  // 拿到图片
  function handleReceiveImage(file: Blob) {
    try {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = () =>{
        setLoadingAIImage(true)
        queryByBuffer(reader.result).then((res) => {
          setImageToText(res[0].generated_text)
          setLoadingAIImage(false)
        })
        return reader.result;
      }
     
    } catch (e) {
      console.log(e)
    }
  }


  useEffect(() => {
    if (shouldTranslateFlag) {
      // 在这里执行你希望在特定情况下的操作
      setTimeout(() => {
        handleTranslateTitleValue(titleValue); // 清除标记，防止重复执行
      }, 500);
      setShouldTranslateFlag(false)
    }
  }, [titleValue, shouldTranslateFlag]);

  // 点击图片获取图片解释
  async function handleClickImageGetExplainText(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Failed to fetch the image: ${response.statusText}`);
      }
      const blob = await response.blob();
      const reader = new FileReader()
      reader.readAsArrayBuffer(blob)
      reader.onload = () =>{
        setIsLoading(true)
        queryByBuffer(reader.result).then((res) => {
          setTitleValue(res[0].generated_text)
          setShouldTranslateFlag(true)
          setIsLoading(false)
        })
        return reader.result;
      }
     
    } catch (e) {
      console.log(e)
    }
  }


  // AI翻译，中文->英文
  // 发送请求
  async function queryTranslateTextToZH(data: any) {
    const accessToken = import.meta.env.VITE_PUBLIC_HUGGINGFACE_API_KEY
    const response = await fetch(
      'https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-zh',
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
    setTranslateButtonLoading(true)
    const result = await response.json().then((res) => {
      setZhTitleValue(res[0]?.translation_text)
      setTranslateButtonLoading(false)
    })
    return result
  }

  function handleTranslateTitleValue(value: any) {
    if (!titleValue && !value) {
      return;
    }
    queryTranslateTextToZH(titleValue || value)
  }
  
  return (
    <ImgContext.Provider
      value={{
        imageList,
        setImageList,
        searchValue,
        setSearchValue,
        isLoading,
        setIsLoading,
        getImage,
        onSearchKeyDown,
        setImgInfo,
        imgInfo,
        uploadImage,
        uploadCurrentImage,
        isUpload,
        setIsUpload,
        authorValue,
        setAuthorValue,
        titleValue,
        setTitleValue,
        fontValue,
        setFontValue,
        handleChangeFont,
        fontSizeValue,
        handleChangeFontSize,
        authorPosition,
        authorPositionList,
        handleAuthorPosition,
        handleChangeCompleteColor,
        hexColor,
        opacityValue,
        setOpacityValue,
        proportionValue,
        handleProportionValue,
        boardTool,
        setBoardTool,
        penSize,
        handlePenSize,
        board_pen_color,
        setHexColor,
        handleChangeBoardPenColor,
        isCircle,
        handleIsCircle,
        setAiValue,
        aiResult,
        loadingAIImage,
        handleGenerateAIImage,
        handleSubmitAIImage,
        imageToText,
        uploadExplainImageUrl,
        uploadExplainImage,
        handleSubmitExplainImage,
        handleClickImageGetExplainText,
        zhTitleValue,
        handleTranslateTitleValue,
        translateButtonLoading,
      }}>
      {children}
    </ImgContext.Provider>
  )
}
