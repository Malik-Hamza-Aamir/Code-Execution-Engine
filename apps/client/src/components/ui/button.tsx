import { ButtonHTMLAttributes } from "react";
import { merge } from "../../utils/classMerge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export function Button({ className = "", children, ...rest }: ButtonProps) {
    return (
        <button
            className={merge(
                "w-full py-[8px] border shadow-sm text-black hover:bg-gray-100/50 rounded-md font-medium transition-colors duration-200 flex items-start justify-center gap-2 disabled:opacity-60 relative",
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
}

export default Button;
