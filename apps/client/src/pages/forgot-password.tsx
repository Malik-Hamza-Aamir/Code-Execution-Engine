import { MultiStep } from "../components";
import { useState } from "react";

export function ForgotPassword() {
    const [step, setStep] = useState("1");

    return (
        <MultiStep currentStep={step}>
            <MultiStep.Content id="1" label="Address">
                <div>
                    <h2 className="text-xl mb-2">Step 1: Address</h2>
                    <button onClick={() => setStep("2")} className="btn">Next</button>
                </div>
            </MultiStep.Content>

            <MultiStep.Content id="2" label="Shipping">
                <div>
                    <h2 className="text-xl mb-2">Step 2: Shipping</h2>
                    <button onClick={() => setStep("3")} className="btn">Next</button>
                </div>
            </MultiStep.Content>

            <MultiStep.Content id="3" label="Payment">
                <div>
                    <h2 className="text-xl mb-2">Step 3: Payment</h2>
                    <button onClick={() => setStep("1")} className="btn">Next</button>
                </div>
            </MultiStep.Content>
        </MultiStep>
    );
}

export default ForgotPassword;
