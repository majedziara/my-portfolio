import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/admin/auth";
import { getSiteContent } from "@/lib/content";
export const metadata = { title: "Sign in" };
export default async function LoginPage() {
  if (await getAdminSession()) redirect("/admin");
  const { navigation } = await getSiteContent();
  return (
    <main id="admin-main" className="admin-login">
      <header className="admin-login-header">
        <Link href="/" prefetch={false} className="admin-brand">
          {navigation.logoText}
          <span>{navigation.logoAccent}</span>
        </Link>
        <Link href="/" prefetch={false} className="admin-text-link">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to website
        </Link>
      </header>
      <div className="admin-login-grid">
        <section className="admin-login-intro">
          <p className="admin-eyebrow">PORTFOLIO STUDIO / 01</p>
          <h1>
            Keep your
            <br />
            work <span>current.</span>
          </h1>
          <p>
            Edit your portfolio, share what you’re working on, and stay on top
            of new enquiries.
          </p>
          <div className="admin-login-outline" aria-hidden="true">
            <span>CONTENT</span>
            <ArrowUpRight size={40} />
            <span>CONTACT</span>
          </div>
        </section>
        <LoginForm />
      </div>
      <footer className="admin-login-footer">
        Your website. Your workspace.
      </footer>
    </main>
  );
}
