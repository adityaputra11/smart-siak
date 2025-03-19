/**
 * Standard API path constants for the application
 * Use these constants to maintain consistent API paths across the application
 */

export const API_PATHS = {
  AUTH: {
    ROOT: 'auth',
    LOGIN: 'login',
    REGISTER: 'register',
    PROFILE: 'profile',
    ADMIN: 'admin',
    STAFF: 'staff',
    ME: 'me',
  },
  USERS: {
    ROOT: 'users',
    PROFILE: 'profile',
  },
  LECTURERS: {
    ROOT: 'lecturers',
    WITH_USER: 'with-user',
    PROFILE: 'profile',
    BY_NIP: 'nip',
  },
  LECTURES: {
    ROOT: 'lectures',
  },
  STUDENTS: {
    ROOT: 'students',
    WITH_USER: 'with-user',
    PROFILE: 'profile',
    BY_NIM: 'nim',
  },
  SUBJECTS: {
    ROOT: 'subjects',
    ENROLLMENT: 'enrollment',
  },
  AI_AGENT: {
    ROOT: 'ai-agent',
    STUDY_PLAN: 'study-plan',
  },
};
