import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/Login");
  };

  const goToRegister = () => {
    router.push("/Register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center px-4 sm:px-8 md:px-16"
      style={{
        background: "linear-gradient(to bottom right, #FF6600, #FF6666, #ffffff)",
      }}
    >
      <div className="bg-white/90 backdrop-blur-md p-8 sm:p-10 md:p-12 rounded-3xl shadow-2xl max-w-xl w-full space-y-8 border border-orange-200">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 tracking-tight">
          Task Management
        </h1>
        <p className="text-center text-lg sm:text-xl text-gray-600">
          Welcome to the Task Management Web Application.
        </p>
        <div className="space-y-4">
          <button
            onClick={goToLogin}
            className="w-full py-3 text-white text-lg font-semibold rounded-xl bg-orange-600 hover:bg-orange-700 transition-all hover:scale-[1.03] cursor-pointer shadow"
          >
            Login
          </button>
          <button
            onClick={goToRegister}
            className="w-full py-3 text-gray-800 text-lg font-semibold rounded-xl bg-white border hover:bg-gray-100 transition-all hover:scale-[1.03] cursor-pointer shadow"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
