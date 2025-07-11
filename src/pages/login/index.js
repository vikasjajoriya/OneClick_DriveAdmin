import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Login_amico from "../../../public/assets/Login-amico.png";
import Link from "next/link";

export async function getServerSideProps(context) {
  const auth = context.req.cookies?.auth === "true";
  if (auth) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return { props: {} };
}

export default function LoginPage() {
  const { login, message } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "admin",
      password: "admin123",
    },
  });

  useEffect(() => {
    const isLoggedIn = document.cookie.includes("auth=true");
    if (isLoggedIn) router.push("/dashboard");
  }, []);

  const onSubmit = (data) => {
    login(data);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans">
      {/* Left Image */}
      <div className="bg-[#06094B] hidden md:flex items-center justify-center">
        <Image
          src={Login_amico}
          alt="Login Illustration"
          width={512}
          height={512}
        />
      </div>

      {/* Right Form */}
      <div className="flex flex-col justify-center items-center px-8 py-12 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
          <p className="text-sm text-gray-600 mb-6">
            Don&apos;t have an account? <Link className="text-[#2563eb] font-medium" href="#">Register here</Link>
          </p>

          {message && <p className="text-red-500 text-sm mb-4">{message}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <div className="relative">
                <input
                  type="text"
                  {...register("username", { required: "Email is required" })}
                  placeholder="Enter email"
                  className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">
                  <i className="fas fa-envelope" />
                </span>
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">
                  <i className="fas fa-eye" />
                </span>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-end gap-2">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                Remember me
              </label>
              <Link href="#" className="text-[#2563eb] hover:underline">Forgot Password?</Link>
            </div>

            <button type="submit" className="w-full bg-[#06094B] text-white py-2 rounded-md font-medium cursor-pointer hover:shadow-lg transition duration-200 disabled:opacity-50" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-full h-px bg-gray-200" />
              <span className="text-sm">or</span>
              <div className="w-full h-px bg-gray-200" />
            </div>

            <button className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2 rounded-md text-sm font-medium hover:bg-gray-50 uppercase">
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={15} height={15} />
              google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}