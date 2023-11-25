import Image from "next/image"

const ZoomImage = ({isOpen, onClose, src}) => {
    return ( isOpen && (
        <div tabindex="-1" className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%)] max-h-full modal-bg">
            <div className="m-auto mt-10 w-max max-h-full relative">
                <Image src={src} width={1280} height={1080} layout="responsive" objectFit="contain" className="max-w-7xl m-auto"></Image>
                <div className="absolute top-0 right-0 bg-black p-2 rounded-full cursor-pointer" onClick={onClose}>
                    <Image src={"/assets/images/close.svg"} width={20} height={20}></Image>
                </div>
            </div>
            
        </div>
    )
    )
}

export default ZoomImage