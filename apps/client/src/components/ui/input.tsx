import { InputHTMLAttributes } from "react";
import { merge } from "../../utils/classMerge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export function Input({ className = '', ...props }: InputProps) {
    return (
        <input
            {...props}
            className={merge('px-3 pt-[8px] pb-[9px] border rounded-md outline-none w-full shadow-sm focus:ring-1 focus:ring-black/50 text-black text-[14px] placeholder:text-[#b2b2b2]', className)}
        />
    )
}

export default Input;