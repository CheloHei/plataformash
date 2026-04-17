// ─── Admin Panel Mock Data ────────────────────────────────────────────────

export interface AdminStudent {
  id: string;
  codUsuario: string;
  nombreVendedor: string;
  codSucursal: string;
  email: string;
  overallProgress: number;
  completedCourses: number;
  totalCourses: number;
  lastActivity: string;
  status: 'active' | 'inactive' | 'completed';
}

export interface AdminExamAnswer {
  questionId: string;
  questionText: string;
  studentSelection: 'correct' | 'partial' | 'failed';
  adminOverride?: 'correct' | 'partial' | 'failed';
  pointsCorrect: number;
  pointsPartial: number;
  pointsFailed: number;
}

export interface AdminExamSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  courseId: string;
  courseName: string;
  lessonId: string;
  lessonTitle: string;
  studentScore: number;       // % score based on student self-assessment
  adminScore: number | null;  // % score after admin override (null = not reviewed)
  maxPossiblePoints: number;
  submittedAt: string;
  timeSpentSeconds: number;
  status: 'pending_review' | 'reviewed';
  answers: AdminExamAnswer[];
}

// ─── Students ─────────────────────────────────────────────────────────────────

export const adminStudents: AdminStudent[] = [
  {
    id: 'u1', codUsuario: 'JPEREZ', nombreVendedor: 'JUAN CARLOS PEREZ',
    codSucursal: 'SUC001', email: 'jperez@shell.com.py',
    overallProgress: 100, completedCourses: 2, totalCourses: 2,
    lastActivity: '2026-04-16', status: 'completed',
  },
  {
    id: 'u2', codUsuario: 'MLOPEZ', nombreVendedor: 'MARIA LOPEZ',
    codSucursal: 'SUC002', email: 'mlopez@shell.com.py',
    overallProgress: 50, completedCourses: 1, totalCourses: 2,
    lastActivity: '2026-04-15', status: 'active',
  },
  {
    id: 'u3', codUsuario: 'CGOMEZ', nombreVendedor: 'CARLOS GOMEZ',
    codSucursal: 'SUC001', email: 'cgomez@shell.com.py',
    overallProgress: 75, completedCourses: 1, totalCourses: 2,
    lastActivity: '2026-04-14', status: 'active',
  },
  {
    id: 'u4', codUsuario: 'ADIAZ', nombreVendedor: 'ANA DIAZ',
    codSucursal: 'SUC003', email: 'adiaz@shell.com.py',
    overallProgress: 0, completedCourses: 0, totalCourses: 2,
    lastActivity: '2026-04-10', status: 'inactive',
  },
  {
    id: 'u5', codUsuario: 'RFLORES', nombreVendedor: 'ROBERTO FLORES',
    codSucursal: 'SUC002', email: 'rflores@shell.com.py',
    overallProgress: 25, completedCourses: 0, totalCourses: 2,
    lastActivity: '2026-04-13', status: 'active',
  },
  {
    id: 'u6', codUsuario: 'LBERNAL', nombreVendedor: 'LUCIA BERNAL',
    codSucursal: 'SUC004', email: 'lbernal@shell.com.py',
    overallProgress: 100, completedCourses: 2, totalCourses: 2,
    lastActivity: '2026-04-17', status: 'completed',
  },
  {
    id: 'u7', codUsuario: 'FMENDEZ', nombreVendedor: 'FERNANDO MENDEZ',
    codSucursal: 'SUC003', email: 'fmendez@shell.com.py',
    overallProgress: 50, completedCourses: 1, totalCourses: 2,
    lastActivity: '2026-04-12', status: 'active',
  },
  {
    id: 'u8', codUsuario: 'SVARGAS', nombreVendedor: 'SOFIA VARGAS',
    codSucursal: 'SUC001', email: 'svargas@shell.com.py',
    overallProgress: 0, completedCourses: 0, totalCourses: 2,
    lastActivity: '2026-03-20', status: 'inactive',
  },
];

// ─── Exam Submissions ─────────────────────────────────────────────────────────

export const examSubmissions: AdminExamSubmission[] = [
  {
    id: 'sub1',
    studentId: 'u1', studentName: 'JUAN CARLOS PEREZ', studentCode: 'JPEREZ',
    courseId: '1', courseName: 'Bienvenido a Shell',
    lessonId: 'lesson-1', lessonTitle: 'Lección 1: Bienvenida a Shell',
    studentScore: 100, adminScore: 100, maxPossiblePoints: 30,
    submittedAt: '2026-04-16T10:23:00', timeSpentSeconds: 430,
    status: 'reviewed',
    answers: [
      { questionId: 'q1', questionText: '¿Cómo se llama el mejor combustible que tenemos en Shell?', studentSelection: 'correct', adminOverride: 'correct', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
      { questionId: 'q2', questionText: '¿Cuál es la diferencia entre diesel y nafta?', studentSelection: 'correct', adminOverride: 'correct', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
      { questionId: 'q3', questionText: '¿Cómo llamamos a nuestro combustible de 97 octanos?', studentSelection: 'correct', adminOverride: 'correct', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
    ],
  },
  {
    id: 'sub2',
    studentId: 'u2', studentName: 'MARIA LOPEZ', studentCode: 'MLOPEZ',
    courseId: '1', courseName: 'Bienvenido a Shell',
    lessonId: 'lesson-1', lessonTitle: 'Lección 1: Bienvenida a Shell',
    studentScore: 67, adminScore: null, maxPossiblePoints: 30,
    submittedAt: '2026-04-15T14:10:00', timeSpentSeconds: 380,
    status: 'pending_review',
    answers: [
      { questionId: 'q1', questionText: '¿Cómo se llama el mejor combustible que tenemos en Shell?', studentSelection: 'correct', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
      { questionId: 'q2', questionText: '¿Cuál es la diferencia entre diesel y nafta?', studentSelection: 'partial', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
      { questionId: 'q3', questionText: '¿Cómo llamamos a nuestro combustible de 97 octanos?', studentSelection: 'correct', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
    ],
  },
  {
    id: 'sub3',
    studentId: 'u3', studentName: 'CARLOS GOMEZ', studentCode: 'CGOMEZ',
    courseId: '1', courseName: 'Bienvenido a Shell',
    lessonId: 'lesson-1', lessonTitle: 'Lección 1: Bienvenida a Shell',
    studentScore: 50, adminScore: null, maxPossiblePoints: 30,
    submittedAt: '2026-04-14T09:45:00', timeSpentSeconds: 520,
    status: 'pending_review',
    answers: [
      { questionId: 'q1', questionText: '¿Cómo se llama el mejor combustible que tenemos en Shell?', studentSelection: 'correct', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
      { questionId: 'q2', questionText: '¿Cuál es la diferencia entre diesel y nafta?', studentSelection: 'failed', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
      { questionId: 'q3', questionText: '¿Cómo llamamos a nuestro combustible de 97 octanos?', studentSelection: 'partial', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
    ],
  },
  {
    id: 'sub4',
    studentId: 'u5', studentName: 'ROBERTO FLORES', studentCode: 'RFLORES',
    courseId: '1', courseName: 'Bienvenido a Shell',
    lessonId: 'lesson-1', lessonTitle: 'Lección 1: Bienvenida a Shell',
    studentScore: 33, adminScore: null, maxPossiblePoints: 30,
    submittedAt: '2026-04-13T16:30:00', timeSpentSeconds: 290,
    status: 'pending_review',
    answers: [
      { questionId: 'q1', questionText: '¿Cómo se llama el mejor combustible que tenemos en Shell?', studentSelection: 'partial', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
      { questionId: 'q2', questionText: '¿Cuál es la diferencia entre diesel y nafta?', studentSelection: 'failed', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
      { questionId: 'q3', questionText: '¿Cómo llamamos a nuestro combustible de 97 octanos?', studentSelection: 'correct', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
    ],
  },
  {
    id: 'sub5',
    studentId: 'u6', studentName: 'LUCIA BERNAL', studentCode: 'LBERNAL',
    courseId: '2', courseName: 'Ciclo de atención al cliente',
    lessonId: 'lesson-2-1', lessonTitle: 'Protocolo de bienvenida',
    studentScore: 100, adminScore: 100, maxPossiblePoints: 50,
    submittedAt: '2026-04-17T08:15:00', timeSpentSeconds: 650,
    status: 'reviewed',
    answers: [
      { questionId: 'q4', questionText: '¿Cuál es el primer paso del ciclo de bienvenida al cliente?', studentSelection: 'correct', adminOverride: 'correct', pointsCorrect: 25, pointsPartial: 12, pointsFailed: 0 },
      { questionId: 'q5', questionText: 'Explica el proceso de cobro y cierre de atención.', studentSelection: 'correct', adminOverride: 'correct', pointsCorrect: 25, pointsPartial: 12, pointsFailed: 0 },
    ],
  },
  {
    id: 'sub6',
    studentId: 'u7', studentName: 'FERNANDO MENDEZ', studentCode: 'FMENDEZ',
    courseId: '1', courseName: 'Bienvenido a Shell',
    lessonId: 'lesson-1', lessonTitle: 'Lección 1: Bienvenida a Shell',
    studentScore: 83, adminScore: 90, maxPossiblePoints: 30,
    submittedAt: '2026-04-12T11:00:00', timeSpentSeconds: 460,
    status: 'reviewed',
    answers: [
      { questionId: 'q1', questionText: '¿Cómo se llama el mejor combustible que tenemos en Shell?', studentSelection: 'correct', adminOverride: 'correct', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
      { questionId: 'q2', questionText: '¿Cuál es la diferencia entre diesel y nafta?', studentSelection: 'partial', adminOverride: 'correct', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
      { questionId: 'q3', questionText: '¿Cómo llamamos a nuestro combustible de 97 octanos?', studentSelection: 'correct', adminOverride: 'correct', pointsCorrect: 10, pointsPartial: 5, pointsFailed: 0 },
    ],
  },
];

// ─── Overview Stats ────────────────────────────────────────────────────────────

export const adminOverviewStats = {
  totalStudents: 8,
  activeStudents: 4,
  completedStudents: 2,
  inactiveStudents: 2,
  totalCourses: 2,
  pendingReviews: 3,
  totalExamsSubmitted: 6,
  avgProgress: 56,
  avgScore: 78,
  moduleStats: [
    { name: 'Módulo 1', label: 'Bienvenido a Shell', completionRate: 75, students: 6 },
    { name: 'Módulo 2', label: 'Ciclo de atención al cliente', completionRate: 25, students: 2 },
  ],
  recentActivity: [
    { studentName: 'LUCIA BERNAL', studentCode: 'LBERNAL', courseName: 'Ciclo de atención al cliente', time: 'Hace 2 horas', status: 'reviewed' as const },
    { studentName: 'CARLOS GOMEZ', studentCode: 'CGOMEZ', courseName: 'Bienvenido a Shell', time: 'Hace 3 horas', status: 'pending_review' as const },
    { studentName: 'ROBERTO FLORES', studentCode: 'RFLORES', courseName: 'Bienvenido a Shell', time: 'Hace 1 día', status: 'pending_review' as const },
    { studentName: 'JUAN CARLOS PEREZ', studentCode: 'JPEREZ', courseName: 'Bienvenido a Shell', time: 'Hace 1 día', status: 'reviewed' as const },
    { studentName: 'MARIA LOPEZ', studentCode: 'MLOPEZ', courseName: 'Bienvenido a Shell', time: 'Hace 2 días', status: 'pending_review' as const },
  ],
};
