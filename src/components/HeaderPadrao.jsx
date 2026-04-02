// src/components/HeaderWMS.jsx
import { Menu } from "lucide-react";
import Logo from "../assets/logo_mantran.png";
import { useIconColor } from "../context/IconColorContext";

export default function HeaderWMS({ toggleSidebar }) {
    const { iconColor, footerIconColorHover } = useIconColor();

    return (
        <header className="flex items-center gap-4 bg-white shadow px-6 h-[48px] fixed top-0 left-0 right-0 z-50 border-b">
            <button
                onClick={toggleSidebar}
                className={`${iconColor} hover:${footerIconColorHover}`}
            >
                <Menu size={22} />
            </button>

            <img src={Logo} className="h-7" />
            <span className="text-sm font-semibold text-gray-700">MÓDULOS</span>
        </header>
    );
}
