import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Eye, EyeOff, Loader2Icon, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HiLightningBolt } from "react-icons/hi";
import Input from "../ui/input";
import Select, {
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";
import { useAuth } from "../../hooks/useAuth";
import { SignupSchema } from "../../schemas/member.schema";
import { days, months, years } from "../../constants/date";
import { SignupFormData } from "../../types/user.type";
import Button from "../ui/button";
import { SocialLogin } from "../molecules";

export function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const { registerNewUser } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  useEffect(() => {
    if (
      confirmPasswordValue &&
      passwordValue !== confirmPasswordValue
    ) {
      setError("confirmPassword", {
        message: "Passwords do not match",
      });
    } else {
      clearErrors("confirmPassword");
    }
  }, [passwordValue, confirmPasswordValue, setError, clearErrors]);

  const onSubmit = async (data: SignupFormData) => {
    let { confirmPassword, dateOfBirth, ...body } = data;
    const { day, month, year } = data.dateOfBirth;
    const dob = new Date(`${month} ${day}, ${year}`).toISOString();
    let payload = { ...body, dob: dob };

    registerNewUser('/auth/register', payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f4] px-4 py-8">
      <div className="w-full max-w-[38rem] bg-[#fefeff] rounded-lg shadow-md p-8 text-black flex flex-col gap-6">
        <div className="bg-black p-2 rounded-md mx-auto w-[37px]">
          <HiLightningBolt className="text-white text-[20px]" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-center text-black">
            Sign up
          </h1>
          <p className="text-center text-gray-500 text-[15px] font-normal">
            Enter your details below to sign up.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex gap-5">
            <div className="h-[90px] relative flex flex-col gap-[6px] w-full">
              <label className="block text-sm font-medium">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("username")}
                placeholder="johndoe"
                className={`${errors.username ? "border-red-500 focus:ring-red-500" : ""
                  } bg-[#f5f5f4]`}
              />
              {errors.username && (
                <small className="text-red-500 absolute bottom-0">
                  {errors.username.message}
                </small>
              )}
            </div>

            <div className="h-[90px] relative flex flex-col gap-[6px] w-full">
              <label className="block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="mail@domain.com"
                className={`${errors.email ? "border-red-500 focus:ring-red-500" : ""
                  } bg-[#f5f5f4]`}
              />
              {errors.email && (
                <small className="text-red-500 absolute bottom-0">
                  {errors.email.message}
                </small>
              )}
            </div>
          </div>

          <div className="md:h-[90px] mb-5 md:mb-0 relative flex flex-col gap-[6px]">
            <label className="block text-sm font-medium">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col md:flex-row justify-between gap-3">
              <Controller
                name="dateOfBirth.day"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={`bg-[#f5f5f4] hover:bg-[#f5f5f4] ${errors.dateOfBirth?.day ? "border-red-500 focus:ring-red-500" : ""}`}>
                      {field.value || "Day"}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup label="Day">
                        {days.map((d) => (
                          <SelectItem key={d} value={d.toString()}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                name="dateOfBirth.month"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={`bg-[#f5f5f4] hover:bg-[#f5f5f4] ${errors.dateOfBirth?.month ? "border-red-500 focus:ring-red-500" : ""}`}>
                      {field.value || "Month"}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup label="Month">
                        {months.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                name="dateOfBirth.year"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={`bg-[#f5f5f4] hover:bg-[#f5f5f4] ${errors.dateOfBirth?.year ? "border-red-500 focus:ring-red-500" : ""}`}>
                      {field.value || "Year"}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup label="Year">
                        {years.map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {errors.dateOfBirth && (
              <small className="text-red-500 absolute bottom-[-22px] md:bottom-0">
                Please select a complete date of birth
              </small>
            )}
          </div>

          <div className="h-[90px] relative flex flex-col gap-[6px]">
            <label className="block text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter password"
                className={`${errors.password ? "border-red-500 focus:ring-red-500" : ""
                  } bg-[#f5f5f4] pr-10`}
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

          <div className="h-[90px] relative flex flex-col gap-[6px]">
            <label className="block text-sm font-medium">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Re-enter password"
                className={`${errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : ""
                  } bg-[#f5f5f4] pr-10`}
              />
            </div>
            {errors.confirmPassword && (
              <small className="text-red-500 absolute bottom-0">
                {errors.confirmPassword.message}
              </small>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-black hover:bg-black/90 text-white"
          >
            {isSubmitting ? <Loader2Icon className="animate-spin" /> : "Sign Up"}
            <ChevronRight className="absolute top-3 right-2" size={15} />
          </Button>
        </form>

        <div className="flex items-center">
          <div className="flex-1 h-px bg-gray-600" />
          <span className="px-3 text-sm pb-1 text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>

        <SocialLogin />

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
