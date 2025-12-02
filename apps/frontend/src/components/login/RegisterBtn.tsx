'use client';

export default function RegisterBtn() {
  const handleRegister = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleRegister}
      className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      Registrarme
    </button>
  );
}
