"use client";
import { useAuthGuard } from "@/hooks/useAuthGuard";


export default function DashboardPage() {
   useAuthGuard();
   return <div>Bienvenido al dashboard</div>;
}
