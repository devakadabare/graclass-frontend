export enum UserRole {
  LECTURER = 'LECTURER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterLecturerDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  qualifications?: string;
}

export interface RegisterStudentDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  university?: string;
  studentId?: string;
}
