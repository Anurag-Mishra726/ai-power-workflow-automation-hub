import React from 'react'
import toast from 'react-hot-toast';
import { Copy } from "lucide-react";

const CopyToClipboard = ({size = 15, text = null}) => {
    const handleCopy = () => {
        console.log("TExt, " ,text)
        try{
            if(!text){
                throw new Error("Failed to copy");
            }

            navigator.clipboard.writeText(text);
            console.log("Copied to clipboard:", text);
            toast.success("Copied to clipboard");
        }
        catch(err){
            console.error("Failed to copy text:", err);
            toast.error("Failed to copy");
        }
    }
  return (
    <>
        <button className=" top-3 left-3 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-md border border-zinc-600 px-2 py-1" 
        onClick={handleCopy}
        >
            <Copy size={size} />
        </button>
    </>
  )
}

export default CopyToClipboard
