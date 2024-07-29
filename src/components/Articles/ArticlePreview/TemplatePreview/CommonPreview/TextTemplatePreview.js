import { useEffect } from "react"

export const TextTemplatePreview=({content,name})=>{
    useEffect(()=>{
        console.log(name)
        document.getElementById(name+'-previewSection').innerHTML=content
    },[name])
    return(
        <div className="w-full p-2 " id={name+'-previewSection'}>
        </div>
    )
}