import { useEffect, useMemo } from "react";

export default function HomeWMS() {

    useEffect(() => {
        // 🏷️ Título da guia do navegador
        document.title = "Mantran - WMS";
    }, []);

    const logoBg = useMemo(() => localStorage.getItem("param_logoBg"), []);

    return (
        <div className="relative flex-1 min-h-[calc(100vh-48px)] p-6">
            {logoBg && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${logoBg})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "35%",
                        opacity: 0.28,
                    }}
                />
            )}

            <div className="relative z-10">
                {/* conteúdo do WMS */}
            </div>
        </div>
    );
}
