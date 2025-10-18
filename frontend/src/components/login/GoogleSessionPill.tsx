"use client";

import Image from "next/image";
import { authService } from "@/features/auth/auth.service";

export default function GoogleSessionPill() {
   return (
      <button
         type="button"
         onClick={authService.GoogleLogin}
         className="inline-flex items-center gap-x-3 border-2 px-7 py-2 rounded-full font-medium hover:bg-gray-50 transition"
      >
         <Image
            src="/googleLogo.svg"
            width={24}
            height={24}
            alt="Google logo"
         />
         <span className="whitespace-nowrap">Inicia sesión con Google</span>
      </button>
   );
}
