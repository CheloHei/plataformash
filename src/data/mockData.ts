import { CourseStatus } from "@/components/StatusBadge";

export interface Question {
  id: string;
  text: string;
  points: {
    correct: number;
    partial: number;
    failed: number;
  };
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  video?: string;
  questions?: Question[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  module: string;
  progress: number;
  status: CourseStatus;
  totalLessons: number;
  completedLessons: number;
  image: string;
  video?: string;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Bienvenido a Shell",
    description: "Introducción integral a los productos premium de Shell y los estándares de excelencia.",
    category: "Inducción",
    module: "Módulo 1",
    progress: 50,
    status: "in-progress",
    totalLessons: 2,
    completedLessons: 1,
    image: "https://www.shell.com.py/about-us/_jcr_content/root/main/section_1901061535/promo_copy_761156079.shellimg.jpeg/1675756236100/retail-station-canopy.jpeg",
    video: "https://youtu.be/gSjSts9H-Do?si=MtHSkXQP4PHCHYV3",
    lessons: [
      {
        id: "1-1",
        title: "Video 1: Productos Shell",
        duration: "12 min",
        completed: true,
        video: "https://www.youtube.com/embed/gSjSts9H-Do",
        questions: [
          {
            id: "q1-1-1",
            text: "¿Cómo se llama el mejor combustible que tenemos en Shell?",
            points: { correct: 10, partial: 5, failed: 0 }
          },
          {
            id: "q1-1-2",
            text: "¿Cual es la diferencia en diesel y nafta?",
            points: { correct: 10, partial: 5, failed: 0 }
          },
          {
            id: "q1-1-3",
            text: "¿Como llamamos a nuestro combustible de 97 octanos?",
            points: { correct: 10, partial: 5, failed: 0 }
          }
        ]
      },
      {
        id: "1-2",
        title: "Video 2: Beneficios V-Power",
        duration: "15 min",
        completed: false,
        video: "https://www.youtube.com/embed/gSjSts9H-Do",
        questions: [
          {
            id: "q1-2-1",
            text: "¿Que beneficios tiene el combstible V-Power?",
            points: { correct: 10, partial: 5, failed: 0 }
          },
          {
            id: "q1-2-2",
            text: "¿Cuándo debo ofrecer el combustible V-Power?",
            points: { correct: 10, partial: 5, failed: 0 }
          }
        ]
      },
    ],
  },
  {
    id: "2",
    title: "Ciclo de atención al cliente",
    description: "Aprende los protocolos de servicio para brindar la mejor experiencia en pista.",
    category: "Servicio",
    module: "Módulo 2",
    progress: 0,
    status: "not-started",
    totalLessons: 1,
    completedLessons: 0,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
    video: "https://youtu.be/hchNW42_wXM?si=DjIDSsPJzVVcQc1J",
    lessons: [
      {
        id: "2-1",
        title: "Preguntas del módulo: Protocolos de Atención",
        duration: "10 min",
        completed: false,
        video: "https://www.youtube.com/embed/gSjSts9H-Do",
        questions: [
          {
            id: "q2-1-1",
            text: "¿Por qué es importante el uso de uniforme?",
            points: { correct: 10, partial: 5, failed: 0 }
          },
          {
            id: "q2-1-2",
            text: "¿Cuantos pasos tiene el ciclo de atención al cliente?",
            points: { correct: 10, partial: 5, failed: 0 }
          },
          {
            id: "q2-1-3",
            text: "En caso de que se acumule mucha gente para cargar combustible, ¿Qué debo hacer?",
            points: { correct: 10, partial: 5, failed: 0 }
          }
        ]
      },
    ],
  },
  // {
  //   id: "3",
  //   title: "SSMA - Seguridad y Salud",
  //   description: "Protocolos esenciales de seguridad, salud y medio ambiente en estaciones de servicio.",
  //   category: "Seguridad",
  //   module: "Módulo 3",
  //   progress: 100,
  //   status: "completed",
  //   totalLessons: 3,
  //   completedLessons: 3,
  //   image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=250&fit=crop",
  //   lessons: [
  //     { id: "3-1", title: "Normativas de seguridad", duration: "20 min", completed: true },
  //     { id: "3-2", title: "Equipos de protección", duration: "15 min", completed: true },
  //     { id: "3-3", title: "Manejo de emergencias", duration: "25 min", completed: true },
  //   ],
  // },
  // {
  //   id: "4",
  //   title: "Ventas Avanzadas",
  //   description: "Técnicas de venta consultiva y cross-selling para maximizar el valor por cliente.",
  //   category: "Ventas",
  //   module: "Módulo 4",
  //   progress: 0,
  //   status: "not-started",
  //   totalLessons: 3,
  //   completedLessons: 0,
  //   image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
  //   lessons: [
  //     { id: "4-1", title: "Fundamentos de venta", duration: "20 min", completed: false },
  //     { id: "4-2", title: "Técnicas de cross-selling", duration: "25 min", completed: false },
  //     { id: "4-3", title: "Cierre de ventas", duration: "15 min", completed: false },
  //   ],
  // },
];

export const userName = "Alejandro Maldonado";
export const userEmail = "alejandro@shell.com";
export const userRole = "Operador de Estación";
