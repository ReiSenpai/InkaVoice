import { Link } from 'react-router-dom'
import { LogoIcon } from './icons'

export default function Navbar({ linkTo = '/login', linkText = 'Iniciar Sesión', showLogo = false }) {
  return (
    <header className="safe-top relative z-20 shrink-0 border-b border-gray-200/60 bg-[#f4f5f7]/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3.5">
        <Link
          to="/login"
          className="flex min-h-[44px] min-w-0 items-center gap-2 transition active:opacity-70"
        >
          {showLogo && <LogoIcon size="sm" />}
          <span
            className="truncate text-xl font-semibold tracking-tight text-inka-green"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            InkaVoice
          </span>
        </Link>
        <Link
          to={linkTo}
          className="touch-target flex shrink-0 items-center px-1 text-sm text-inka-green transition active:opacity-70"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {linkText}
        </Link>
      </div>
    </header>
  )
}
