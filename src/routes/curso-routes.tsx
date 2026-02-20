import CourseDetail from "@/pages/CourseDetail"
import Courses from "@/pages/Courses"
import Index from "@/pages/Index"
import { LoginPage } from "@/pages/LoginPage"
import NotFound from "@/pages/NotFound"
import Progress from "@/pages/Progress"
import { Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "./ProtectedRoute"


export const CursoRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <Index />
                </ProtectedRoute>
            } />
            <Route path="/cursos" element={
                <ProtectedRoute>
                    <Courses />
                </ProtectedRoute>
            } />
            <Route path="/cursos/:id" element={
                <ProtectedRoute>
                    <CourseDetail />
                </ProtectedRoute>
            } />
            <Route path="/progreso" element={
                <ProtectedRoute>
                    <Progress />
                </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}