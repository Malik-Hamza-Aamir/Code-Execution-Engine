import { createContext, useContext, useState, useRef, useEffect, ReactNode, HTMLAttributes } from "react";
import { merge } from "../../utils/classMerge";

type Alignment = "left" | "center" | "right";

interface DropdownContextValue {
    open: boolean;
    setOpen: (value: boolean) => void;
    align: Alignment;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
    const context = useContext(DropdownContext);
    if (!context) throw new Error("Dropdown components must be used inside <Dropdownmenu>");
    return context;
}

interface DropdownMenuProps {
    children: ReactNode;
    className?: string;
    align?: Alignment;
}

export function Dropdownmenu({ children, className, align = "left" }: DropdownMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <DropdownContext.Provider value={{ open, setOpen, align }}>
            <div ref={ref} className={merge("relative inline-block text-left", className || '')}>
                {children}
            </div>
        </DropdownContext.Provider>
    );
}

interface TriggerProps {
    children: ReactNode;
    className?: string;
}

function DropdownTrigger({ children, className }: TriggerProps) {
    const { open, setOpen } = useDropdownContext();

    return (
        <div
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-haspopup="true"
            className={merge("cursor-pointer inline-flex", className || '')}
        >
            {children}
        </div>
    );
}

interface ContentProps extends HTMLAttributes<HTMLDivElement> { }

function DropdownContent({ className, children, ...rest }: ContentProps) {
    const { open, setOpen, align } = useDropdownContext();

    const alignmentClasses = {
        left: "left-0",
        center: "left-1/2 -translate-x-1/2",
        right: "right-0",
    };

    const dropdownClass = merge(
        `absolute z-50 mt-2 w-48 bg-white border border-gray-200 text-black rounded-lg shadow-lg 
     transition-all duration-200 ease-in-out opacity-0 scale-95 
     ${alignmentClasses[align]} 
     data-[open=true]:opacity-100 data-[open=true]:scale-100`,
        className || ''
    );

    return (
        <div
            className={dropdownClass}
            style={{
                transformOrigin: align === "right" ? "top right" : "top left",
                display: open ? "block" : "none",
            }}
            data-open={open}
            onClick={() => setOpen(false)}
            {...rest}
        >
            <div className="py-2 cursor-pointer">{children}</div>
        </div>
    );
}

// Attach components
Dropdownmenu.Trigger = DropdownTrigger;
Dropdownmenu.Content = DropdownContent;

export default Dropdownmenu;
