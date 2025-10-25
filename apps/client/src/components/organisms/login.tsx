import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2Icon, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HiLightningBolt } from "react-icons/hi";
import Input from '../ui/input';
import Button from '../ui/button';
import { SocialLogin } from '../molecules';
import { LoginSchema } from '../../schemas/member.schema';
import { LoginFormData } from '../../types/user.type';
import { useAuth } from '../../hooks/useAuth';

export function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        await login('/auth/login', data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f4] px-4 py-8">
            <div className="w-full max-w-[28rem] bg-[#fefeff] rounded-lg shadow-md p-8 text-black flex flex-col gap-6">
                <div className='bg-black p-2 rounded-md mx-auto w-[37px]'>
                    <HiLightningBolt className='text-white text-[20px]' />
                </div>

                <div className='flex flex-col gap-2'>
                    <h1 className="text-xl font-semibold text-center text-black"> Sign in</h1>
                    <p className='text-center text-gray-500 text-[15px] font-normal'>Enter your email and password below to signin.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='h-[90px] relative flex flex-col gap-[6px]'>
                        <label className="block text-sm font-medium" htmlFor="email">
                            Email <span className='text-red-500'>*</span>
                        </label>
                        <Input
                            type="email"
                            id="email"
                            {...register("email")}
                            placeholder="mail@domain.com"
                            className={`${errors.email ? 'border-red-500 focus:ring-red-500' : ''} bg-[#f5f5f4]`}
                        />
                        {errors.email && (
                            <small className="text-red-500 absolute bottom-0">
                                {errors.email.message}
                            </small>
                        )}
                    </div>

                    <div className='h-[90px] relative flex flex-col gap-[6px]'>
                        <label className="block text-sm font-medium" htmlFor="password">
                            Password <span className='text-red-500'>*</span>
                        </label>
                        <div className='relative'>
                            <Input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                {...register("password")}
                                placeholder="Enter password"
                                className={`${errors.password ? 'border-red-500 focus:ring-red-500' : ''} bg-[#f5f5f4] pr-10`}
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
                            <small className="text-red-500 absolute bottom-0">
                                {errors.password.message}
                            </small>
                        )}
                    </div>

                    <div className="text-right">
                        <Link
                            to="/forgot-password"
                            className="text-sm underline font-semibold"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black hover:bg-black/90 text-white"
                    >
                        {isSubmitting ? <Loader2Icon className="animate-spin" /> : "Login"}
                        <ChevronRight className='absolute top-3 right-2' size={15} />
                    </Button>
                </form>

                <div className="flex items-center">
                    <div className="flex-1 h-px bg-gray-600" />
                    <span className="px-3 text-sm pb-1 text-gray-400">or</span>
                    <div className="flex-1 h-px bg-gray-600" />
                </div>

                <SocialLogin />

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don’t have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-black font-medium underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
