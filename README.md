# Plataforma de Entrenamiento Shell

Aplicación web de e-learning desarrollada para Shell, orientada a la capacitación interna del personal de estaciones de servicio. Permite a los empleados completar cursos, ver videos instructivos, rendir exámenes y hacer seguimiento de su progreso de forma progresiva.

## Funcionalidades

- **Autenticación** con credenciales corporativas y persistencia de sesión
- **Dashboard** con estadísticas en tiempo real de progreso del usuario
- **Catálogo de cursos** organizados por módulos, con progresión secuencial (el Módulo 2 requiere completar el Módulo 1)
- **Lecciones con video** embebido desde YouTube directamente en la card del curso
- **Exámenes por lección** con sistema de puntaje (correcto / parcial / fallido) y control de tiempo
- **Desbloqueo secuencial** de lecciones: se requiere 100% en el examen anterior para avanzar
- **Progreso en tiempo real** sincronizado desde localStorage, sin necesidad de recargar la página
- **Página "Mi Progreso"** con estadísticas globales, desglose por módulo y detalle por curso
- **Tema claro/oscuro** con persistencia de preferencia
- **Diseño responsive** para mobile y desktop

## Tecnologías

- **React 18** + **TypeScript**
- **Vite** como bundler
- **Zustand** para manejo de estado global con persistencia en localStorage
- **React Router v6** con rutas protegidas
- **Tailwind CSS** + **shadcn/ui** para componentes y estilos
- **Framer Motion** para animaciones
- **Axios** con interceptores para manejo de tokens y refresh automático
- **React Hook Form** + **Zod** para validación de formularios

## Instalación

```bash
npm install
npm run dev