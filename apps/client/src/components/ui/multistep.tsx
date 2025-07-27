import React, { ReactNode, createContext, useContext, useMemo } from "react";
import { merge } from "../../utils/classMerge";

interface StepContextType {
    currentStep: string;
}

const StepContext = createContext<StepContextType | null>(null);

function useStepContext() {
    const ctx = useContext(StepContext);
    if (!ctx) throw new Error("Must be used inside <MultiStep>");
    return ctx;
}

interface MultiStepProps {
    currentStep: string;
    children: ReactNode;
    className?: string;
}

interface ContentProps {
    id: string;
    label: string;
    children: ReactNode;
    className?: string;
}

function MultiStep({ currentStep, children, className = "" }: MultiStepProps) {
    const steps = useMemo(() => {
        return React.Children.toArray(children) as React.ReactElement<ContentProps>[];
    }, [children]);

    const stepLabels = useMemo(() => {
        return steps.map((step) => ({
            id: step.props.id,
            label: step.props.label,
        }));
    }, [steps]);

    return (
        <StepContext.Provider value={{ currentStep }}>
            <div className={merge("w-full", className)}>
                {/* Top Progress Bar */}
                <div className="flex items-center justify-between mb-8 relative">
                    {stepLabels.map((step, index) => {
                        const isCompleted = parseInt(currentStep) > parseInt(step.id);
                        const isActive = step.id === currentStep;

                        return (
                            <div key={step.id} className="flex-1 flex flex-col items-center relative">
                                {/* Line */}
                                {index > 0 && (
                                    <div
                                        className={`absolute top-2.5 -left-1/2 w-full h-3 z-0 ${isCompleted || isActive ? "bg-purple-800" : "bg-purple-200"
                                            }`}
                                    />
                                )}

                                {/* Circle */}
                                <div
                                    className={merge(
                                        "z-10 w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-medium",
                                        isCompleted || isActive
                                            ? "bg-purple-800 text-white border-purple-800"
                                            : "bg-white text-purple-400 border-purple-200",
                                        isActive ? "pulse-ripple" : ""
                                    )}
                                >
                                    {step.id}
                                </div>

                                {/* Label */}
                                <div className="mt-2 text-sm text-purple-800 text-center">
                                    {step.label}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Active Step Content */}
                {steps}
            </div>
        </StepContext.Provider>
    );
}

// ---------- Content Component ----------
function Content({ id, children, className }: ContentProps) {
    const { currentStep } = useStepContext();

    if (id !== currentStep) return null;

    return <div className={merge("w-full", className || "")}>{children}</div>;
}

// ---------- Attach Subcomponent ----------
MultiStep.Content = Content;

export default MultiStep;
