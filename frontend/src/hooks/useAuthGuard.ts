"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export function useAuthGuard() {
   const router = useRouter()
   const { user, isLoading } = useUserStore()

   useEffect(() => {
      if (!user && !isLoading) {
         router.replace('/login')
      }
   }, [user, isLoading, router]) // update this every time that user, isLoading or router change
}