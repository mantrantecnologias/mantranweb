import { Link } from 'react-router-dom'
import { Ticket, FileText, FileCog, Boxes, ScrollText } from 'lucide-react'


export default function Topbar() {
return (
<header className="mantran-header text-white px-4 py-2 flex items-center justify-between">
<div className="flex items-center gap-3">
<button className="text-white/90 text-sm font-semibold hidden">Menu</button>
<img src="/logo.svg" alt="Mantran" className="h-6" onError={(e)=>{e.currentTarget.style.display='none'}}/>
</div>


{/* atalhos do topo */}
<nav className="flex items-center gap-6 text-xs">
<Link to="/atalhos/viagem" className="flex items-center gap-1 hover:underline"><ScrollText size={16}/> Viagem</Link>
<Link to="/atalhos/nfse" className="flex items-center gap-1 hover:underline"><FileText size={16}/> NFSe</Link>
<Link to="/atalhos/cte" className="flex items-center gap-1 hover:underline"><Ticket size={16}/> CTe</Link>
<Link to="/atalhos/coleta" className="flex items-center gap-1 hover:underline"><Boxes size={16}/> Coleta</Link>
<Link to="/atalhos/manifesto" className="flex items-center gap-1 hover:underline"><FileCog size={16}/> Manifesto</Link>
</nav>


<div className="text-xs">Usuário: <b>SUPORTE</b></div>
</header>
)
}