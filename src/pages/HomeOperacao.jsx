import { useEffect, useMemo } from "react";
import { useIconColor } from "../context/IconColorContext";

export default function HomeOperacao() {
    const { setIconColor } = useIconColor();

    useEffect(() => {
        // 🔐 DEFINE O MÓDULO ATIVO (ESSENCIAL)
        localStorage.setItem("mantran_modulo", "operacao");

        // 🔴 Cor padrão do módulo Operação
        setIconColor("text-red-700");

        // 🏷️ Título da aba
        document.title = "Mantran - Operação";
    }, [setIconColor]);

    const logoBg = useMemo(
        () => localStorage.getItem("param_logoBg"),
        []
    );

    return (
        <div className="relative min-h-[calc(100vh-48px)] p-6">
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
                {/* conteúdo do Operação */}
            </div>
        </div>
    );
}
