import Image from "next/image"

const ModalResult = ({isOpen, onClose, result, action, errorDetail}) => {
    return ( isOpen && (
        <div tabindex="-1" className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%)] max-h-full">
            <div className="relative m-auto mt-20 w-full max-w-md max-h-full">
                <div className="relativ rounded-lg shadow dark-400">
                    <button onClick={onClose} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" >
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-6 text-center">
                        {result ? (
                            <Image className="m-auto" src={"/assets/images/success.gif"} width={50} height={50}></Image>
                        ) : (
                            <Image className="m-auto" src={"/assets/images/error.gif"} width={50} height={50}></Image>
                        )} 
                        <h3 className="my-2 text-lg font-normal text-gray-200 dark:text-gray-200">{action} {result ? "successfully!" : "fail!"}</h3>
                        <div className="mb-5 text-base font-normal text-gray-200">{errorDetail}</div>
                        <button onClick={onClose} type="button" className="mx-3 text-white  dark-300  focus:ring-4 focus:outline-none rounded-lg text-sm font-medium px-5 py-2.5 focus:z-10 ">OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
        

    )
}

export default ModalResult