import { useEffect, useMemo } from "react";
import { useIconColor } from "../context/IconColorContext";

export default function HomeSeguranca() {
    const { setIconColor, setFooterIconColorNormal, setFooterIconColorHover } = useIconColor();

    useEffect(() => {
        // 🔥 1. DEFINE O MÓDULO ATIVO PRIMEIRO
        localStorage.setItem("mantran_modulo", "seguranca");

        // 🏷️ 2. Título da guia do navegador
        document.title = "Mantran - Segurança";

        // 🔴 3. Carrega cores salvas do Segurança ou usa o padrão vermelho
        const savedColor = localStorage.getItem("seg_iconColor") || "text-red-700";
        const savedFooter = localStorage.getItem("seg_footerNormal") || "text-red-700";
        const savedHover = localStorage.getItem("seg_footerHover") || "text-red-900";

        setIconColor(savedColor);
        if (setFooterIconColorNormal) setFooterIconColorNormal(savedFooter);
        if (setFooterIconColorHover) setFooterIconColorHover(savedHover);
    }, [setIconColor, setFooterIconColorNormal, setFooterIconColorHover]);

    const logoBg = useMemo(() => localStorage.getItem("param_logoBg"), []);

    return (
        <main className="relative flex-1 min-h-[calc(100vh-48px)] p-4 overflow-auto mt-4 ml-4">
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
                {/* cards, gráficos, grids do segurança */}
            </div>
        </main>
    );
}
