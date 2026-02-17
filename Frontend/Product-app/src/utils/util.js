import { toast } from "react-toastify";


export const HandleSuccess=(msg)=>{
    toast.success(msg,{position:'top-right'})
}
export const HandleError=(msg)=>{
    toast.error(msg,{position:'top-right'})
}