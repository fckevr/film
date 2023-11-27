import Image from "next/image"

const Film = ({name, thumbnail, flex, tag, view}) => {
  return (
    flex == "y" ? (
      <div className="h-full w-full text-center rounded-lg shadow-xl hover:shadow-2xl group cursor-pointer flex flex-col">
        <div className="relative h-3/4 w-full rounded-lg flex-grow">
          <p className="absolute z-50 text-sm primary-300 px-2 top-4 rounded-e-md">{tag}</p>
          <Image title={name} className="rounded-t-lg " src={thumbnail.includes("//") ? thumbnail : "/assets/thumbnail/" + thumbnail} objectFit="cover"  layout="fill" alt={name}></Image>   
        </div>
        <div className="text-white h-1/4 px-1 py-1 group-hover:text-yellow-400 overflow-hidden flex-shrink" style={{ minHeight: "3.5em", maxHeight: "5em", fontSize: "14px"}}>
          <p className="max-two-lines ">{name}</p>
        </div>
      </div>
       
    )
    : (
      <div className="h-full w-full text-center rounded-lg shadow-xl flex hover:shadow-2xl group cursor-pointer">
        <div className="relative w-2/4 rounded-lg">
          <Image title={name} className="rounded-t-xl " src={thumbnail.includes("//") ? thumbnail : "/assets/thumbnail/" + thumbnail} objectFit="cover" layout="fill" alt={name}></Image>   
        </div>  
        <div className="w-2/4 flex flex-col">
          <p className="mx-2 overflow-hidden w-full h-4/5 text-white group-hover:text-yellow-400">
            <div className="overflow-hidden text-ellipsis">
              {name}    
            </div>
          </p>   
          <p className="text-primary-600 h-1/5">View: {view}</p>
        </div>
      </div>
    )
  )
}

export default Film