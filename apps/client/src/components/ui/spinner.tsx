import { merge } from "../../utils/classMerge";

interface SpinnerProps {
    className: string;
}

export function Spinner({ className = "" }: SpinnerProps) {
    return <div className={merge("animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500", className)} />
}

export default Spinner;