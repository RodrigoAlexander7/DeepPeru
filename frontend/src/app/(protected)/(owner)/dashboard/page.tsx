"use client";
import { useAuthGuard } from "@/hooks/useAuthGuard";


export default function DashboardPage() {
   const ready = useAuthGuard();

   if (!ready) {
      return (
         <div><p>Loading session...</p></div>
      )
   }
   return <div>Bienvenido al dashboard</div>;
}
