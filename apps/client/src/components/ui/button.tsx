import { ButtonHTMLAttributes } from "react";
import { merge } from "../../utils/classMerge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export function Button({ className = "", children, ...rest }: ButtonProps) {
    return (
        <button
            className={merge(
                "inline-flex items-center justify-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition",
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
}

export default Button;
