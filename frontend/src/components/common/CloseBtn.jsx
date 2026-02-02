import { X } from "lucide-react";

const CloseBtn = ({onClose}) => {
  return (
    <div className="flex justify-center items-center absolute top-0 right-0 mt-2 mr-2 p-1 rounded-full text-white bg-zinc-500
         hover:bg-red-500 ">
        <button onClick={onClose}>
            <X size={17} />
        </button>
    </div>
  )
}

export default CloseBtn
