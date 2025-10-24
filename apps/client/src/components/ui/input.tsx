import { InputHTMLAttributes } from "react";
import { merge } from "../../utils/classMerge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export function Input({ className = '', ...props }: InputProps) {
    return (
        <input
            {...props}
            className={merge('px-3 py-2 border rounded-lg outline-none w-full shadow-sm border-surface-100 focus:ring-2 focus:ring-primary-200', className)}
        />
    )
}

export default Input;