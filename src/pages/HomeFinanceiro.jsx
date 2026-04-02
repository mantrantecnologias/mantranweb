import { useEffect, useMemo } from "react";
import { useIconColor } from "../context/IconColorContext";

export default function HomeFinanceiro() {
    const { setIconColor, setFooterIconColorNormal, setFooterIconColorHover } = useIconColor();

    useEffect(() => {
        // 🔥 1. DEFINE O MÓDULO ATIVO PRIMEIRO
        localStorage.setItem("mantran_modulo", "financeiro");

        // 🏷️ 2. Título da guia do navegador
        document.title = "Mantran - Financeiro";

        // 🟢 3. Carrega cores salvas do Financeiro ou usa o padrão verde
        const savedColor = localStorage.getItem("fin_iconColor") || "text-green-700";
        const savedFooter = localStorage.getItem("fin_footerNormal") || "text-green-700";
        const savedHover = localStorage.getItem("fin_footerHover") || "text-green-900";

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
                {/* cards, gráficos, grids do financeiro */}
            </div>
        </main>
    );
}
