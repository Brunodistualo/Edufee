import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const jwtpassword = process.env.JWT_SECRET || 'secret';

export async function middleware(req: NextRequest) {

  const cook = req.cookies.get('authToken');
  const token = cook?.value as string;

  if (!token) {
    console.log("No se encontró token, redirigiendo a login.");
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

    if (isAdmin && (isAccessingStudent || isAccessingInstitution)) {
      console.log("Redirigiendo a /dashboard-admin");
      return NextResponse.redirect(new URL('/dashboard-admin', req.url));
    }
    if (isStudent && (isAccessingAdmin || isAccessingInstitution)) {
      console.log("Redirigiendo a /student/dashboard");
      return NextResponse.redirect(new URL('/student/dashboard', req.url));
    }
    if (isInstitution && (isAccessingAdmin || isAccessingStudent)) {
      console.log("Redirigiendo a /institution/dashboard");
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
