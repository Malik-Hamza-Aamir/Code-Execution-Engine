import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Loader2Icon, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HiLightningBolt } from "react-icons/hi";
import { ImGithub } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";
import Input from "../ui/input";
import Select, {
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1969 }, (_, i) => 1970 + i);
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const SignupSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "Password must include at least one number and one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    dateOfBirth: z.object({
      day: z.string().min(1, "Select day"),
      month: z.string().min(1, "Select month"),
      year: z.string().min(1, "Select year"),
    }),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type SignupFormData = z.infer<typeof SignupSchema>;

export function Signup() {
  const [showPassword, setShowPassword] = useState(false);

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
    const { day, month, year } = data.dateOfBirth;
    const dateOfBirth = new Date(`${month} ${day}, ${year}`);

    console.log("✅ Signup Data:", {
      ...data,
      dateOfBirth,
    });
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-[8px] mt-1 bg-black hover:bg-black/90 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-60 relative"
          >
            {isSubmitting ? <Loader2Icon className="animate-spin" /> : "Sign Up"}
            <ChevronRight className="absolute top-3 right-2" size={15} />
          </button>
        </form>

        <div className="flex items-center">
          <div className="flex-1 h-px bg-gray-600" />
          <span className="px-3 text-sm pb-1 text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            className="w-full py-[8px] border shadow-sm text-black hover:bg-gray-100/50 rounded-md font-medium transition-colors duration-200 flex items-start justify-center gap-2"
          >
            <FcGoogle className="text-2xl" />
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            className="w-full py-[8px] border shadow-sm text-black hover:bg-gray-100/50 rounded-md font-medium transition-colors duration-200 flex items-start justify-center gap-2"
          >
            <ImGithub className="text-xl mt-[2px]" />
            Continue with GitHub
          </button>
        </div>

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
