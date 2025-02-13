
// app/(auth)/register/page.tsx
import Link from 'next/link';
import RegisterForm from '@/app/(components)/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">Create Account</h1>
        <RegisterForm />
        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

