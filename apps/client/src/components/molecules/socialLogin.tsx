import { useState } from "react";
import Button from "../ui/button";
import { ImGithub } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";

export function SocialLogin() {
    const [isSocialLoading, setIsSocialLoading] = useState({
        google: false,
        github: false,
    });

    const handleSocialLogin = (provider: 'google' | 'github') => {
        setIsSocialLoading((prev) => ({ ...prev, [provider]: true }));
        window.location.href = `${import.meta.env.VITE_MEMBER_API_URL}/auth/${provider}`;
    };

    return (
        <div className="space-y-3">
            <Button
                type="button"
                className="text-black hover:bg-gray-100/50"
                onClick={() => handleSocialLogin('google')}
                disabled={isSocialLoading.google}
            >
                <FcGoogle className="text-2xl" />
                <span>Continue with Google</span>
            </Button>

            <Button
                type="button"
                className="text-black hover:bg-gray-100/50"
                onClick={() => handleSocialLogin('github')}
                disabled={isSocialLoading.github}
            >
                <ImGithub className="text-xl mt-[2px]" />
                Continue with GitHub
            </Button>
        </div>
    )
}

export default SocialLogin;