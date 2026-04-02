import { useEffect, useMemo } from "react";
import { useIconColor } from "../context/IconColorContext";

export default function HomeOficina() {
    const { setIconColor, setFooterIconColorNormal, setFooterIconColorHover } = useIconColor();

    useEffect(() => {
        // 🔥 1. DEFINE O MÓDULO ATIVO PRIMEIRO
        localStorage.setItem("mantran_modulo", "oficina");

        // 🏷️ 2. Título da guia do navegador
        document.title = "Mantran - Oficina";

        // 🟠 3. Carrega cores salvas da Oficina ou usa o padrão laranja
        const savedColor = localStorage.getItem("oficina_iconColor") || "text-orange-700";
        const savedFooter = localStorage.getItem("oficina_footerNormal") || "text-orange-700";
        const savedHover = localStorage.getItem("oficina_footerHover") || "text-orange-900";

        setIconColor(savedColor);
        if (setFooterIconColorNormal) setFooterIconColorNormal(savedFooter);
        if (setFooterIconColorHover) setFooterIconColorHover(savedHover);
    }, [setIconColor, setFooterIconColorNormal, setFooterIconColorHover]);

    const logoBg = useMemo(() => localStorage.getItem("param_logoBg"), []);

    return (
        <main className="relative flex-1 min-h-[calc(100vh-48px)] px-4 pb-4 pt-0 overflow-auto">
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
                <h1 className="text-2xl font-bold text-orange-700">Painel Oficina</h1>
                <p className="text-gray-600 mt-2">Bem-vindo ao módulo de gestão de oficina.</p>
            </div>
        </main>
    );
}
