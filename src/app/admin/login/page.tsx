/**
 * app/admin/login/page.tsx
 * Login dinonaktifkan — redirect langsung ke /admin.
 */
import { redirect } from 'next/navigation';

export default function AdminLoginPage() {
  redirect('/admin');
}
