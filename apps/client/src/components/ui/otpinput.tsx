import * as React from "react";

interface OTPInputProps {
    total?: number; // number of OTP boxes
    value?: string;
    onChange?: (val: string) => void;
}

export function OTPInput({ total = 6, value = "", onChange }: OTPInputProps) {
    const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
    const [values, setValues] = React.useState<string[]>(Array(total).fill(""));

    // Sync with external value
    React.useEffect(() => {
        if (value && value.length === total) {
            setValues(value.split(""));
        }
    }, [value, total]);

    const handleChange = (index: number, val: string) => {
        if (!/^[0-9a-zA-Z]?$/.test(val)) return; // Only alphanumeric single char

        const newValues = [...values];
        newValues[index] = val;
        setValues(newValues);
        onChange?.(newValues.join(""));

        // Move focus to next field if current filled
        if (val && index < total - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (values[index]) {
                const newValues = [...values];
                newValues[index] = "";
                setValues(newValues);
                onChange?.(newValues.join(""));
            } else if (index > 0) {
                const newValues = [...values];
                newValues[index - 1] = "";
                setValues(newValues);
                onChange?.(newValues.join(""));
                inputsRef.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").trim().slice(0, total).split("");
        const newValues = [...values];
        for (let i = 0; i < pasteData.length; i++) {
            newValues[index + i] = pasteData[i];
        }
        setValues(newValues);
        onChange?.(newValues.join(""));
        const nextIndex = Math.min(index + pasteData.length, total - 1);
        inputsRef.current[nextIndex]?.focus();
    };

    return (
        <div className="flex justify-between gap-2">
            {Array.from({ length: total }).map((_, i) => (
                <input
                    key={i}
                    ref={(el) => {
                        // ✅ FIX: don’t return anything — just assign
                        inputsRef.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={values[i]}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={(e) => handlePaste(e, i)}
                    className="w-12 h-12 text-center text-lg font-medium rounded-md border ring-1 ring-black/50 focus:ring-black outline-none transition-all"
                />
            ))}
        </div>
    );
}

export default OTPInput;
