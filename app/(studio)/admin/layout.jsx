import "./admin.css";
export const metadata = {
  title: { default: "Portfolio Studio", template: "%s | Portfolio Studio" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};
export const dynamic = "force-dynamic";
export default function AdminLayout({ children }) {
  return (
    <div className="admin-surface">
      <a className="skip-link" href="#admin-main">
        Skip to main content
      </a>
      {children}
    </div>
  );
}
