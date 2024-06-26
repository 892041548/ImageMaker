import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Button,
  Input,
  ScrollShadow,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react'
import { UploadLogo } from './logo'
import { ImgContext } from '@/context'
import { Key, useContext } from 'react'

export default function LeftBoard() {
  const {
    imageList,
    searchValue,
    setSearchValue,
    isLoading,
    getImage,
    onSearchKeyDown,
    setImgInfo,
    uploadImage,
    setIsUpload,
    setAiValue,
    aiResult,
    loadingAIImage,
    handleGenerateAIImage,
    handleSubmitAIImage,
    uploadExplainImageUrl,
    uploadExplainImage,
    imageToText,
    handleSubmitExplainImage,
  } = useContext(ImgContext)

  // 用于AI生成图片的弹出窗
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isUploadOpen, onOpen: openUpload , onClose: closeUpload } = useDisclosure()

  function handleUploadImage(event: any) {
    const file = event.target.files[0]
    if (file) {
      uploadImage(file)
      // 浏览器对于文件重新选择，不会执行上次的操作，所以这里清空值，让上传相同图片可以执行
      event.target.value = ''
    }
  }

  function handleUploadExplainImage(event: any) {
    const file = event.target.files[0]
    if (file) {
      uploadExplainImage(file)
      // 浏览器对于文件重新选择，不会执行上次的操作，所以这里清空值，让上传相同图片可以执行
      event.target.value = ''
    }
  }

  

  // 打开弹出窗
  function handleOpen() {
    onOpen()
  }
  function handleUpload() {
    openUpload()
  }
  return (
    <div className='flex flex-col bg-slate-500 h-screen'>
      <>
        <Navbar>
          <NavbarBrand>
            <img
            style={{width: '20px'}}
              src='/favicon-left.png'
              alt=''
            />
            <p className='font-bold text-inherit'>ImageMaker</p>
          </NavbarBrand>

          <NavbarContent justify='end'>
            <NavbarItem>
              <Avatar
                isBordered
                src='/user.png'
              />
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      </>

      <ScrollShadow>
        <div className='flex-grow overflow-y-scroll overflow-x-hidden justify-center flex flex-wrap scrollbar-thin scrollbar-color-auto '>
          {imageList && imageList?.length == 0 ? (
            <div className='flex items-center justify-center  transition-transform duration-200 transform hover:scale-105 rounded m-2 cursor-pointer w-5/12 object-cover h-screen'>
              没有找到图片
            </div>
          ) : (
            imageList &&
            imageList.map(
              (item: {
                id: Key | null | undefined
                urls: { small: string | undefined }
                alt_description: string | undefined
              }) => {
                return (
                  <img
                    key={item.id}
                    src={item.urls.small}
                    alt={item.alt_description}
                    className='transition-transform duration-200 transform hover:scale-105 rounded m-2 cursor-pointer w-5/12 object-cover h-24'
                    onClick={() => {
                      setImgInfo(item)
                      setIsUpload(false)
                    }}
                  />
                )
              }
            )
          )}
        </div>
      </ScrollShadow>

      <>
        <Navbar className='relative'>
          {/* 上传图片 */}
          <label>
            <input
              type='file'
              onChange={handleUploadImage}
              className='hidden'
            />
            <Button
              variant='flat'
              isIconOnly
              as='span'>
              <UploadLogo />
            </Button>
          </label>

          <Input
            type='search'
            color='default'
            placeholder='请输入内容搜索图片'
            value={searchValue}
            onValueChange={setSearchValue}
            onKeyDown={(e) => onSearchKeyDown(e)}
          />

          <NavbarContent justify='end'>
            <NavbarItem>
              <Button
                isLoading={isLoading}
                isIconOnly
                onClick={() => getImage(searchValue)}>
                搜索
              </Button>
            </NavbarItem>
          </NavbarContent>

          <div className='flex absolute top-[-40px] left-2 w-30 h-7 bg-black bg-opacity-65 rounded-[8px] items-center justify-center '>
            <Button
              onPress={handleOpen}
              className='text-white cursor-pointer'>
              🌟AI生成🔥
            </Button>
            <Button
              onPress={handleUpload}
              className='text-white cursor-pointer ml-10'>
              🌟AI读取图片🔥
            </Button>
          </div>
        </Navbar>
      </>

      <>
        <Modal
          backdrop='blur'
          isOpen={isOpen}
          onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  AI生成（test）
                </ModalHeader>
                <ModalBody>
                  <div>
                    <div className='flex'>
                      <Input
                        type='text'
                        placeholder='请输入内容(英文)'
                        onChange={(e) => setAiValue(e.target.value)}
                      />
                      <Button
                        color='success'
                        className='ml-2'
                        isLoading={loadingAIImage}
                        onClick={handleGenerateAIImage}>
                        生成
                      </Button>
                    </div>
                    <div>
                      {aiResult && (
                        <img
                          src={aiResult}
                          alt='ai-img'
                          className='w-[400px] h-[400px] rounded-md mt-2'
                        />
                      )}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color='danger'
                    variant='light'
                    onPress={onClose}>
                    取消
                  </Button>
                  <Button
                    onClick={handleSubmitAIImage}
                    onPress={onClose}
                    className='bg-gradient-to-tr from-pink-500 to-yellow-500'>
                    使用
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
      <>
        <Modal
          backdrop='blur'
          isOpen={isUploadOpen}
          onClose={closeUpload}>
          <ModalContent>
            {(closeUpload) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  AI读取图片内容（test）
                </ModalHeader>
                <ModalBody>
                  <div>


                    <label>
                      <input
                        type='file'
                        onChange={handleUploadExplainImage}
                        className='hidden'
                      />
                      <Button
                        variant='flat'
                        isIconOnly
                        isLoading={loadingAIImage}
                        as='span'>
                        <UploadLogo />
                      </Button>
                    </label>
                    <div>
                      {uploadExplainImageUrl && (
                        <img
                          src={uploadExplainImageUrl}
                          alt='ai-img'
                          style={{objectFit: 'contain'}}
                          className='w-[400px] h-[400px] rounded-md mt-2'
                        />
                      )}
                    </div>
                    <div>
                      {imageToText && imageToText}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color='danger'
                    variant='light'
                    onPress={closeUpload}>
                    取消
                  </Button>
                  <Button
                    onClick={handleSubmitExplainImage}
                    onPress={closeUpload}
                    className='bg-gradient-to-tr from-pink-500 to-yellow-500'>
                    使用
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  )
}
