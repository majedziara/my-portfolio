import { requireAdminPage } from "@/lib/admin/auth";
import SecurityForm from "@/components/admin/SecurityForm";
export const metadata = { title: "Security" };
export default async function SecurityPage() {
  const session = await requireAdminPage();
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">ACCOUNT</p>
          <h1>Security</h1>
          <p className="admin-muted">
            Keep your access private. Update your password when needed.
          </p>
        </div>
      </div>
      <SecurityForm csrf={session.csrf} />
    </>
  );
}
