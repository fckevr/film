import Image from "next/image"

const ModalReport = ({isOpen, onClose, filmId, onReported}) => {
    const reportHandle = async () => {
        try {
            const formData = new FormData()
            formData.append("film", filmId)
            formData.append("status", "0")
            const response = await fetch("/api/report/createOrUpdate", {
                method: "POST",
                body: formData
            })
            if (response.ok) {
                onReported(true)
                onClose()
            }
            else {
                onReported(false)
                onClose()
            }
        }
        catch (error) {
           
        }
    }
    return ( isOpen && (
        <div tabindex="-1" className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%)] max-h-full modal-bg">
            <div className="relative m-auto mt-20 w-full max-w-md max-h-full">
                <div className="relative rounded-lg shadow dark-400">
                    <button onClick={onClose} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" >
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-6 text-center">
                        <Image className="m-auto" src={"/assets/images/reported.svg"} width={50} height={50}></Image>
                        <h3 className="mb-5 mt-5 text-lg font-normal text-gray-200">Report Film Error?</h3>
                        <button onClick={reportHandle} type="button" className="primary-500 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mx-3">
                            Report
                        </button>
                        <button onClick={onClose} type="button" className="mx-3 text-white  dark-300  focus:ring-4 focus:outline-none rounded-lg text-sm font-medium px-5 py-2.5 focus:z-10 ">No</button>
                    </div>
                </div>
            </div>
        </div>
    )

    )
}

export default ModalReport