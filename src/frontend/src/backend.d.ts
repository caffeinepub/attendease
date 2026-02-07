import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type PhoneNumber = string;
export interface Class {
    id: bigint;
    name: string;
    teacher: Principal;
}
export interface AttendanceRecord {
    date: bigint;
    presentStudents: Array<bigint>;
}
export interface UserProfile {
    name: string;
    role: UserRole;
    phoneNumber: PhoneNumber;
}
export interface Student {
    id: bigint;
    name: string;
    parentPhone: PhoneNumber;
    classId: bigint;
}
export enum UserRole {
    teacher = "teacher",
    parent = "parent"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addStudent(classId: bigint, name: string, parentPhone: PhoneNumber): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createClass(name: string): Promise<bigint>;
    getAttendance(classId: bigint, date: bigint): Promise<AttendanceRecord | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getClassStudents(classId: bigint): Promise<Array<Student>>;
    getMyStudents(): Promise<Array<Student>>;
    getStudentAttendanceHistory(studentId: bigint): Promise<Array<AttendanceRecord>>;
    getTeacherClasses(): Promise<Array<Class>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    takeAttendance(classId: bigint, date: bigint, presentStudentIds: Array<bigint>): Promise<void>;
}
