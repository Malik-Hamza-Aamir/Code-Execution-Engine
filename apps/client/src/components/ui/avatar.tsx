import { merge } from "../../utils/classMerge";

interface AvatarProps {
    src?: string;
    name?: string;
    className?: string;
}

export function Avatar({ src, name, className = "" }: AvatarProps) {
    return src ? (
        <img src={src} className={merge("w-8 h-8 rounded-full object-cover", className)} alt={name} />
    ) : (
        <div className={merge("w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-sm", className)}>{(name || '?').charAt(0)}</div>
    )
}

export default Avatar;