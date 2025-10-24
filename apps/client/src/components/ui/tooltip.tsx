import React, {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { merge } from "../../utils/classMerge";

type Placement = "top" | "bottom" | "left" | "right";

interface TooltipContextValue {
    open: boolean;
    show: () => void;
    hide: () => void;
    contentId: string;
    rootRef: React.RefObject<HTMLDivElement>;
    triggerRef: React.RefObject<HTMLElement | null>;
    placement: Placement;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext(componentName = "Tooltip") {
    const ctx = useContext(TooltipContext);
    if (!ctx) throw new Error(`${componentName} must be used inside Tooltip`);
    return ctx;
}

let uid = 0;
function nextId() {
    uid += 1;
    return `tooltip-${uid}`;
}

/**
 * Tooltip (root)
 *
 * Props:
 *  - placement: top | bottom | left | right (default: top)
 *  - delayShow / delayHide: milliseconds before show/hide (defaults: 200 / 100)
 */
export const Tooltip = forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<{
        placement?: Placement;
        delayShow?: number;
        delayHide?: number;
        className?: string;
        // If you want to control open state externally, extend here (not implemented now).
    }>
>(({ children, placement = "top", delayShow = 200, delayHide = 100, className }, ref) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const showTimeout = useRef<number | null>(null);
    const hideTimeout = useRef<number | null>(null);
    const contentIdRef = useRef<string>(nextId());

    // forward ref to wrapper div if user passed ref
    useEffect(() => {
        // noop; just to satisfy forwardRef typing - we'll attach below
    }, []);

    useEffect(() => {
        return () => {
            if (showTimeout.current) window.clearTimeout(showTimeout.current);
            if (hideTimeout.current) window.clearTimeout(hideTimeout.current);
        };
    }, []);

    const show = useCallback(() => {
        if (hideTimeout.current) {
            window.clearTimeout(hideTimeout.current);
            hideTimeout.current = null;
        }
        if (showTimeout.current) return; // already scheduled
        showTimeout.current = window.setTimeout(() => {
            setOpen(true);
            showTimeout.current = null;
        }, delayShow);
    }, [delayShow]);

    const hide = useCallback(() => {
        if (showTimeout.current) {
            window.clearTimeout(showTimeout.current);
            showTimeout.current = null;
        }
        if (hideTimeout.current) return;
        hideTimeout.current = window.setTimeout(() => {
            setOpen(false);
            hideTimeout.current = null;
        }, delayHide);
    }, [delayHide]);

    // Close on Escape when open
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape" && open) {
                setOpen(false);
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    // expose the refs via ref and context
    // forward ref
    useEffect(() => {
        if (!ref) return;
        if (typeof ref === "function") {
            ref(rootRef.current);
        } else {
            // @ts-ignore
            ref.current = rootRef.current;
        }
    }, [ref]);

    const value: TooltipContextValue = {
        open,
        show,
        hide,
        contentId: contentIdRef.current,
        rootRef: rootRef as React.RefObject<HTMLDivElement>,
        triggerRef,
        placement,
    };

    return (
        <TooltipContext.Provider value={value}>
            <div ref={rootRef} className={merge("relative inline-block", className ?? "")}>
                {children}
            </div>
        </TooltipContext.Provider>
    );
});
Tooltip.displayName = "Tooltip";

/**
 * TooltipTrigger
 *
 * Wraps whatever element you want to be the trigger.
 * Accepts a single child (button, span, div, etc).
 */
export const TooltipTrigger = forwardRef<
    HTMLElement,
    React.PropsWithChildren<{
        asChild?: boolean; // if you want to pass child element directly
        className?: string;
        // optionally allow onClick etc to be passed through
    }>
>(({ children, className }, ref) => {
    const { show, hide, contentId, triggerRef } = useTooltipContext("TooltipTrigger");
    const childRef = useRef<HTMLElement | null>(null);

    // merge refs
    useEffect(() => {
        const node = childRef.current;
        triggerRef.current = node ?? null;
        if (!ref) return;
        if (typeof ref === "function") {
            ref(node);
        } else {
            // @ts-ignore
            ref.current = node;
        }
        return () => {
            // cleanup
            if (triggerRef.current === node) triggerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);

    // we expect a single React element child
    const child = React.Children.only(children) as React.ReactElement;

    const props: any = {
        onMouseEnter: (e: React.MouseEvent) => {
            show();
            if (child.props.onMouseEnter) child.props.onMouseEnter(e);
        },
        onFocus: (e: React.FocusEvent) => {
            show();
            if (child.props.onFocus) child.props.onFocus(e);
        },
        onMouseLeave: (e: React.MouseEvent) => {
            hide();
            if (child.props.onMouseLeave) child.props.onMouseLeave(e);
        },
        onBlur: (e: React.FocusEvent) => {
            hide();
            if (child.props.onBlur) child.props.onBlur(e);
        },
        // accessibility: refer to content via aria-describedby
        "aria-describedby": contentId,
        ref: (node: HTMLElement | null) => {
            // attach our ref and the child's ref if it exists
            childRef.current = node;
            const origRef = (child as any).ref;
            if (typeof origRef === "function") origRef(node);
            else if (origRef) origRef.current = node;
        },
        className: merge("inline-flex items-center", (child.props && child.props.className) ?? "", className ?? ""),
    };

    return React.cloneElement(child, props);
});
TooltipTrigger.displayName = "TooltipTrigger";

/**
 * TooltipContent
 *
 * Renders the tooltip box. It will position itself relative to the trigger.
 * It only renders into DOM when visible.
 */
export const TooltipContent = forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<{
        className?: string;
        style?: React.CSSProperties;
        // optional max width for long content
        maxWidth?: string | number;
    }>
>(({ children, className, style, maxWidth = 240 }, ref) => {
    const { open, rootRef, triggerRef, contentId, placement } = useTooltipContext("TooltipContent");
    const contentRef = useRef<HTMLDivElement | null>(null);

    const [pos, setPos] = useState<{ top: number; left: number; transform: string } | null>(null);

    // compute position when open, or when trigger changes
    useLayoutEffect(() => {
        if (!open) return setPos(null);
        const trigger = triggerRef.current;
        const content = contentRef.current;
        const root = rootRef.current;
        if (!trigger || !content || !root) return;

        const tr = trigger.getBoundingClientRect();
        const ct = content.getBoundingClientRect();
        const rootRect = root.getBoundingClientRect();

        // position relative to the root container (absolute)
        let top = 0;
        let left = 0;
        let transform = "";

        const gap = 8; // space between trigger and tooltip

        switch (placement) {
            case "top":
                top = tr.top - rootRect.top - ct.height - gap;
                left = tr.left - rootRect.left + tr.width / 2 - ct.width / 2;
                transform = "translateY(0)";
                break;
            case "bottom":
                top = tr.bottom - rootRect.top + gap;
                left = tr.left - rootRect.left + tr.width / 2 - ct.width / 2;
                transform = "translateY(0)";
                break;
            case "left":
                top = tr.top - rootRect.top + tr.height / 2 - ct.height / 2;
                left = tr.left - rootRect.left - ct.width - gap;
                transform = "translateX(0)";
                break;
            case "right":
                top = tr.top - rootRect.top + tr.height / 2 - ct.height / 2;
                left = tr.right - rootRect.left + gap;
                transform = "translateX(0)";
                break;
            default:
                top = tr.top - rootRect.top - ct.height - gap;
                left = tr.left - rootRect.left + tr.width / 2 - ct.width / 2;
        }

        // clamp horizontally to stay inside root container
        const minLeft = 0;
        const maxLeft = rootRect.width - ct.width;
        if (left < minLeft) left = minLeft + 4;
        if (left > maxLeft) left = maxLeft - 4;

        // clamp vertically a bit
        const minTop = 0;
        const maxTop = rootRect.height - ct.height;
        if (top < minTop) top = minTop + 4;
        if (top > maxTop) top = maxTop - 4;

        setPos({ top, left, transform });
    }, [open, placement, triggerRef, rootRef, children]);

    // hide if user scrolls the root out of view (simple approach)
    useEffect(() => {
        if (!open) return;
        const onScroll = () => {
            // recompute position on scroll
            if (contentRef.current) {
                // use layout effect; here we just force recompute by toggling state
                // simpler: call setPos(null) and let layoutEffect run; but we can recompute synchronously
                // trigger an update by calling the layout effect dependency indirectly: read DOM.
                const _ = contentRef.current.getBoundingClientRect();
                // no-op, layout effect will run if dimensions changed next tick
            }
        };
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onScroll);
        };
    }, [open]);

    if (!open) return null;

    return (
        <div
            ref={(node) => {
                contentRef.current = node;
                if (!ref) return;
                if (typeof ref === "function") ref(node);
                else (ref as any).current = node;
            }}
            id={contentId}
            role="tooltip"
            style={{
                position: "absolute",
                top: pos?.top ?? 0,
                left: pos?.left ?? 0,
                maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
                zIndex: 9999,
                ...style,
            }}
            className={merge(
                "pointer-events-none select-none rounded-md px-3 py-1 text-xs leading-5 shadow-md border border-surface-200 bg-surface-800 text-white",
                className ?? ""
            )}
        // pointer-events-none so that hovering the tooltip itself doesn't interfere with trigger hover
        // If you prefer the tooltip to be interactive, remove pointer-events-none and handle hide/show differently
        >
            {children}
        </div>
    );
});
TooltipContent.displayName = "TooltipContent";
