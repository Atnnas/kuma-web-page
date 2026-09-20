import { DidacticReportClientPage } from "@/components/admin/DidacticReportClientPage";

export const metadata = {
    title: "Auditoría de Progreso Didáctico | Kuma Dojo Admin",
    description: "Supervisión en vivo de alumnos en el tatami interactivo: frecuencia de entrada, días de inactividad y avance hacia el siguiente cinturón.",
};

export default function DidacticReportPage() {
    return <DidacticReportClientPage />;
}
