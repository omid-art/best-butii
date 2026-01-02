// app/admin/page.tsx
import AdminDashboard from "@/components/pages/admin/admin";
import AdminGuard from "./guard";

export default function AdminPage() {
  return( <AdminGuard> <AdminDashboard /> </AdminGuard>);
}
