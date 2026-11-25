import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider';

export const metadata = {
  title: { default: 'Admin Panel', template: '%s | AIMS IBS Admin' },
  description: 'AIMS IBS Admin Panel',
  robots: { index: false, follow: false },
};

// No <html>/<body> here — root layout provides those.
// Root layout detects /admin pathname and skips Header/Footer.
export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}
