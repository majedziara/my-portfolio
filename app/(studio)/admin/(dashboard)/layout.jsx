import DashboardShell from "@/components/admin/DashboardShell";
import { requireAdminPage } from "@/lib/admin/auth";
import { getSiteContent } from "@/lib/content";
export default async function DashboardLayout({ children }) {
  const session = await requireAdminPage();
  const { navigation } = await getSiteContent();
  return (
    <DashboardShell csrf={session.csrf} brand={navigation.logoText}>
      {children}
    </DashboardShell>
  );
}
