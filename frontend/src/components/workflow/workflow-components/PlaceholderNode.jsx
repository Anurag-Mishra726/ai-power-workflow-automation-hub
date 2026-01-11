import React, { useCallback } from "react";
import { Plus } from "lucide-react";

export const PlaceholderNode = ({ data }) => {

  return (
    <div
      className="w-14 h-8 flex justify-center items-center
                 border border-dashed border-zinc-500
                 rounded-xl bg-zinc-900 cursor-pointer"
      onClick={data.onAddClick}
    >
      <Plus size={16} className="text-zinc-400" />
    </div>
  );
}


export const AddNodeBtn = ({onClose}) => {
  return (
    <>
      <div className= "flex justify-center items-center p-1 rounded-md bg-zinc-700 hover:bg-zinc-500">
        <button className=" text-white" onClick={onClose}>
          <Plus/>
        </button>
      </div>
    </>
  )
}

