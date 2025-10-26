import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2Icon, ChevronRight } from "lucide-react";
import { HiLightningBolt } from "react-icons/hi";
import Input from "../ui/input";
import Button from "../ui/button";
import OTPInput from "../ui/otpinput";
import { EmailSchema, OTPSchema, UpdatePasswordSchema } from "../../schemas/member.schema";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export function Forgotpassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState<"email" | "otp" | "updatePassword">("email");
    const [email, setEmail] = useState<string>("");
    const { forgetPassword, forgetPasswordState, verifyOtp, verifyOtpState, resetPassword, resetPasswordState } = useAuth();

    const emailForm = useForm<z.infer<typeof EmailSchema>>({
        resolver: zodResolver(EmailSchema),
    });

    const handleEmailSubmit = async (data: z.infer<typeof EmailSchema>) => {
        await forgetPassword(`/auth/forgot-password/${data.email}`);
        setEmail(data.email);
        setStep("otp");
    };

    const otpForm = useForm<z.infer<typeof OTPSchema>>({
        resolver: zodResolver(OTPSchema),
    });

    const handleOtpSubmit = async (data: z.infer<typeof OTPSchema>) => {
        const payload = { email, otp: data.otp };
        await verifyOtp(`/auth/verify-otp`, payload);
        setStep("updatePassword");
    };

    const passwordForm = useForm<z.infer<typeof UpdatePasswordSchema>>({
        resolver: zodResolver(UpdatePasswordSchema),
    });

    const handlePasswordSubmit = async (data: z.infer<typeof UpdatePasswordSchema>) => {
        const payLoad = { email, password: data.password, otp: otpForm.getValues("otp") };
        resetPassword(`/auth/reset-password`, payLoad);
    };

    const renderStepForm = () => {
        if (step === "email") {
            const { register, handleSubmit, formState: { errors } } = emailForm;
            return (
                <form onSubmit={handleSubmit(handleEmailSubmit)}>
                    <div className="h-[90px] relative flex flex-col gap-[6px]">
                        <label className="block text-sm font-medium" htmlFor="email">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="email"
                            id="email"
                            {...register("email")}
                            placeholder="mail@domain.com"
                            className={`${errors.email ? "border-red-500 focus:ring-red-500" : ""} bg-[#f5f5f4]`}
                        />
                        {errors.email && (
                            <small className="text-red-500 absolute bottom-0">{errors.email.message}</small>
                        )}
                    </div>

                    <div className="flex gap-3 mt-3">
                        <Link
                            to="/login"
                            className="flex items-center justify-center border-2 rounded-md font-medium hover:bg-gray-100/50 w-full transition-colors duration-200"
                        >
                            Cancel
                        </Link>
                        <Button
                            type="submit"
                            disabled={forgetPasswordState.loading}
                            className="bg-black hover:bg-black/90 text-white"
                        >
                            {forgetPasswordState.loading ? <Loader2Icon className="animate-spin" /> : "Send OTP"}
                            <ChevronRight className="absolute top-3 right-2" size={15} />
                        </Button>
                    </div>
                </form>
            );
        }

        if (step === "otp") {
            const { handleSubmit, formState: { errors }, setValue } = otpForm;
            return (
                <form onSubmit={handleSubmit(handleOtpSubmit)}>
                    <div className="h-[90px] relative flex flex-col gap-[6px]">
                        <OTPInput
                            total={6}
                            value={otpForm.watch("otp") || ""}
                            onChange={(val) => setValue("otp", val)}
                        />
                        {errors.otp && (
                            <small className="text-red-500 absolute bottom-0">{errors.otp.message}</small>
                        )}
                    </div>
                    <Button
                        type="submit"
                        disabled={verifyOtpState.loading}
                        className="bg-black hover:bg-black/90 text-white mt-3"
                    >
                        {verifyOtpState.loading ? <Loader2Icon className="animate-spin" /> : "Verify OTP"}
                        <ChevronRight className="absolute top-3 right-2" size={15} />
                    </Button>
                </form>
            );
        }

        if (step === "updatePassword") {
            const { register, handleSubmit, formState: { errors } } = passwordForm;
            return (
                <form onSubmit={handleSubmit(handlePasswordSubmit)}>
                    <div className="h-[90px] relative flex flex-col gap-[6px]">
                        <label className="block text-sm font-medium">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                placeholder="Enter password"
                                className={`${errors.password ? "border-red-500 focus:ring-red-500" : ""} bg-[#f5f5f4] pr-10`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-400"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <small className="text-red-500 absolute bottom-0">{errors.password.message}</small>
                        )}
                    </div>

                    <div className="h-[90px] relative flex flex-col gap-[6px]">
                        <label className="block text-sm font-medium">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type={showPassword ? "text" : "password"}
                            {...register("confirmPassword")}
                            placeholder="Re-enter password"
                            className={`${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""} bg-[#f5f5f4]`}
                        />
                        {errors.confirmPassword && (
                            <small className="text-red-500 absolute bottom-0">{errors.confirmPassword.message}</small>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={resetPasswordState.loading}
                        className="bg-black hover:bg-black/90 text-white mt-3"
                    >
                        {resetPasswordState.loading ? <Loader2Icon className="animate-spin" /> : "Update Password"}
                        <ChevronRight className="absolute top-3 right-2" size={15} />
                    </Button>
                </form>
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f4] px-4 py-8">
            <div className="w-full max-w-[28rem] bg-[#fefeff] rounded-lg shadow-md p-8 text-black flex flex-col gap-6">
                <div className="bg-black p-2 rounded-md mx-auto w-[37px]">
                    <HiLightningBolt className="text-white text-[20px]" />
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl font-semibold text-center text-black">Forgot Password</h1>
                    <p className="text-center text-gray-500 text-[15px] font-normal">
                        {step === "email" && "Please enter your email to receive an OTP."}
                        {step === "otp" && "Please enter the 6-digit OTP sent to your email."}
                        {step === "updatePassword" && "Please enter your new password."}
                    </p>
                </div>
                {renderStepForm()}
            </div>
        </div>
    );
}

export default Forgotpassword;
