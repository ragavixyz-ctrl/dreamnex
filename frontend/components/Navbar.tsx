'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Store, User, LogOut, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-6 w-6 text-primary" />
            DreamNex
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/create-store">
                  <Button variant="ghost">
                    <Store className="h-4 w-4 mr-2" />
                    Create Store
                  </Button>
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost">Admin</Button>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Button variant="ghost">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

