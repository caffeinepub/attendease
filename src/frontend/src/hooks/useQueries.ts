import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, Class, Student, AttendanceRecord } from '../backend';

export function useGetCallerProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['callerProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerProfile'] });
    },
  });
}

export function useGetTeacherClasses() {
  const { actor, isFetching } = useActor();

  return useQuery<Class[]>({
    queryKey: ['teacherClasses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTeacherClasses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateClass() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClass(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherClasses'] });
    },
  });
}

export function useGetClassStudents(classId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Student[]>({
    queryKey: ['classStudents', classId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getClassStudents(classId);
    },
    enabled: !!actor && !isFetching && classId > 0n,
  });
}

export function useAddStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      name,
      parentPhone,
    }: {
      classId: bigint;
      name: string;
      parentPhone: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addStudent(classId, name, parentPhone);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['classStudents', variables.classId.toString()] });
    },
  });
}

export function useGetAttendance(classId: bigint, date: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<AttendanceRecord | null>({
    queryKey: ['attendance', classId.toString(), date.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAttendance(classId, date);
    },
    enabled: !!actor && !isFetching && classId > 0n,
  });
}

export function useTakeAttendance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      date,
      presentStudentIds,
    }: {
      classId: bigint;
      date: bigint;
      presentStudentIds: bigint[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.takeAttendance(classId, date, presentStudentIds);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendance', variables.classId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['studentAttendanceHistory'] });
    },
  });
}

export function useGetMyStudents(refetchInterval?: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Student[]>({
    queryKey: ['myStudents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyStudents();
    },
    enabled: !!actor && !isFetching,
    refetchInterval,
  });
}

export function useGetStudentAttendanceHistory(studentId: bigint | null, refetchInterval?: number) {
  const { actor, isFetching } = useActor();

  return useQuery<AttendanceRecord[]>({
    queryKey: ['studentAttendanceHistory', studentId?.toString()],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getStudentAttendanceHistory(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
    refetchInterval,
  });
}
