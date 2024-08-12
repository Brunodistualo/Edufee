import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const jwtpassword = process.env.JWT_SECRET || 'secret';

export async function middleware(req: NextRequest) {
  const cook = req.cookies.get('authToken');
  const token = cook?.value as string; 

  if (!token) {
    return NextResponse.redirect(new URL('/api/auth/login', req.url));
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userRole = payload.roles;

    const isAdmin = userRole.includes("admin");
    const isStudent = userRole.includes("student");
    const isInstitution = userRole.includes("institution");

    const isAccessingAdmin = req.nextUrl.pathname.startsWith("/dashboard-admin");
    const isAccessingStudent = req.nextUrl.pathname.startsWith("/student/dashboard");
    const isAccessingInstitution = req.nextUrl.pathname.startsWith("/institution/dashboard");

    // Condiciones para evitar redirecciones infinitas
    if (isAdmin && (isAccessingStudent || isAccessingInstitution)) {
      return NextResponse.redirect(new URL('/dashboard-admin', req.url));
    }
    if (isStudent && (isAccessingAdmin || isAccessingInstitution)) {
      return NextResponse.redirect(new URL('/student/dashboard', req.url));
    }
    if (isInstitution && (isAccessingAdmin || isAccessingStudent)) {
      return NextResponse.redirect(new URL('/institution/dashboard', req.url));
    }
    
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return NextResponse.redirect(new URL('/api/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard-admin','/student/dashboard','/institution/dashboard'],
};
