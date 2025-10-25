import * as React from "react";
import { merge } from "../../utils/classMerge";

interface SelectContextProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    value: string | undefined;
    setValue: (value: string) => void;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
}

const SelectContext = React.createContext<SelectContextProps | null>(null);

function useSelectContext(component: string) {
    const ctx = React.useContext(SelectContext);
    if (!ctx)
        throw new Error(`${component} must be used within a <Select> component.`);
    return ctx;
}

/* -------------------------------------------------------------------------- */
/*                                  Root                                      */
/* -------------------------------------------------------------------------- */

export const Select = ({
    defaultValue,
    value: controlledValue,
    onValueChange,
    children,
}: {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
}) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<string | undefined>(defaultValue);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    const isControlled = controlledValue !== undefined;
    const selectedValue = isControlled ? controlledValue : value;

    const handleChange = (val: string) => {
        if (!isControlled) setValue(val);
        onValueChange?.(val);
        setOpen(false);
    };

    // 🔸 Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                triggerRef.current &&
                contentRef.current &&
                !triggerRef.current.contains(target) &&
                !contentRef.current.contains(target)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <SelectContext.Provider
            value={{
                open,
                setOpen,
                value: selectedValue,
                setValue: handleChange,
                triggerRef,
                contentRef,
            }}
        >
            <div className="relative w-full">{children}</div>
        </SelectContext.Provider>
    );
};

/* -------------------------------------------------------------------------- */
/*                                 Trigger                                    */
/* -------------------------------------------------------------------------- */

export const SelectTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const { open, setOpen, value, triggerRef } = useSelectContext("SelectTrigger");

    return (
        <button
            ref={(node) => {
                if (typeof ref === "function") ref(node);
                else if (ref)
                    (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
                        node;
                triggerRef.current = node;
            }}
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={merge(
                "flex items-center justify-between w-full rounded-md border px-3 py-2 text-sm",
                "bg-white text-gray-900 hover:bg-gray-50 transition-colors",
                "focus:outline-none focus:ring-1 focus:ring-black/50",
                className ?? ""
            )}
            {...props}
        >
            <span className="truncate">{children || value || "Select an option"}</span>
            <svg
                className={merge(
                    "w-4 h-4 transition-transform ml-2",
                    open ? "rotate-180" : "rotate-0"
                )}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    );
});
SelectTrigger.displayName = "SelectTrigger";

/* -------------------------------------------------------------------------- */
/*                                 Content                                    */
/* -------------------------------------------------------------------------- */

export const SelectContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, style, ...props }, ref) => {
    const { open, triggerRef, contentRef } = useSelectContext("SelectContent");

    const [width, setWidth] = React.useState<number | undefined>(undefined);

    // 🔸 Match trigger width (but allow override)
    React.useEffect(() => {
        if (triggerRef.current) {
            setWidth(triggerRef.current.offsetWidth);
        }
    }, [triggerRef, open]);

    if (!open) return null;

    return (
        <div
            ref={(node) => {
                if (typeof ref === "function") ref(node);
                else if (ref)
                    (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
                contentRef.current = node;
            }}
            className={merge(
                "absolute left-0 mt-1 z-50 bg-white border rounded-md shadow-md",
                "max-h-60 overflow-auto",
                className ?? ""
            )}
            style={{
                width, // matches trigger
                ...style, // overridable
            }}
            {...props}
        >
            {children}
        </div>
    );
});
SelectContent.displayName = "SelectContent";

/* -------------------------------------------------------------------------- */
/*                                   Group                                    */
/* -------------------------------------------------------------------------- */

export const SelectGroup = ({
    label,
    children,
}: {
    label?: string;
    children: React.ReactNode;
}) => (
    <div className="py-1">
        {label && (
            <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">
                {label}
            </div>
        )}
        {children}
    </div>
);
SelectGroup.displayName = "SelectGroup";

/* -------------------------------------------------------------------------- */
/*                                   Item                                     */
/* -------------------------------------------------------------------------- */

export const SelectItem = ({
    value,
    children,
    className,
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
}) => {
    const { setValue, value: selectedValue } = useSelectContext("SelectItem");
    const isSelected = selectedValue === value;

    return (
        <div
            onClick={() => setValue(value)}
            className={merge(
                "cursor-pointer select-none px-3 py-2 text-sm rounded-sm",
                "hover:bg-gray-50 text-gray-700",
                isSelected ? "bg-gray-100 font-medium text-gray-900" : "",
                className ?? ""
            )}
        >
            {children}
        </div>
    );
};
SelectItem.displayName = "SelectItem";

/* -------------------------------------------------------------------------- */
/*                                 Exports                                    */
/* -------------------------------------------------------------------------- */

const SelectExport = Object.assign(Select, {
    Content: SelectContent,
    Group: SelectGroup,
    Item: SelectItem,
    Trigger: SelectTrigger,
});

export default SelectExport;
