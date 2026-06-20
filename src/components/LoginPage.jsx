import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  GlobeIcon,
  GoogleIcon,
  GuestIcon,
  HelpIcon,
  LockIcon,
  LogoIcon,
  MailIcon,
  ShieldIcon,
} from './icons'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-full flex-col bg-[#f4f5f7]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <main className="safe-top safe-bottom relative z-10 flex flex-1 flex-col items-center px-4 py-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <LogoIcon showDiamond />
          <h1
            className="mt-4 text-[2rem] font-bold tracking-tight text-inka-green"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            InkaVoice
          </h1>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.35em] text-gray-500">
            Ecos de una civilización
          </p>
        </div>

        <div className="w-full rounded-2xl border border-gray-100 bg-white px-5 py-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-gray-500"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <MailIcon />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  className="touch-target w-full rounded-xl border border-inka-border bg-white py-0 pl-10 pr-4 text-base text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-inka-green focus:ring-2 focus:ring-inka-green/10"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label
                  htmlFor="password"
                  className="text-[11px] font-semibold uppercase tracking-wider text-gray-500"
                >
                  Contraseña
                </label>
                <a
                  href="#"
                  className="shrink-0 text-xs font-medium text-inka-gold active:opacity-70"
                >
                  ¿Olvidaste la clave?
                </a>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="touch-target w-full rounded-xl border border-inka-border bg-white py-0 pl-10 pr-4 text-base text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-inka-green focus:ring-2 focus:ring-inka-green/10"
                />
              </div>
            </div>

            <button
              type="submit"
              className="touch-target flex w-full items-center justify-center gap-2 rounded-xl bg-inka-green py-0 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition active:scale-[0.98]"
            >
              Iniciar sesión
              <ArrowRightIcon />
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              O continuar con
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              className="touch-target flex w-full items-center justify-center gap-3 rounded-xl border border-inka-border bg-white py-0 text-sm font-medium text-gray-700 transition active:scale-[0.98]"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              type="button"
              className="touch-target flex w-full items-center justify-center gap-2 rounded-xl border border-inka-gold/60 bg-white py-0 text-sm font-medium text-inka-gold transition active:scale-[0.98]"
            >
              <GuestIcon />
              Continuar como invitado
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-[13px] text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link
            to="/registro"
            className="font-semibold text-inka-teal active:opacity-70"
          >
            Regístrate aquí
          </Link>
        </p>

        <div className="mt-6 flex items-center gap-5 text-gray-400">
          <button
            type="button"
            className="touch-target flex items-center justify-center rounded-full p-2 active:bg-gray-200/60"
            aria-label="Idioma"
          >
            <GlobeIcon />
          </button>
          <button
            type="button"
            className="touch-target flex items-center justify-center rounded-full p-2 active:bg-gray-200/60"
            aria-label="Privacidad"
          >
            <ShieldIcon />
          </button>
          <button
            type="button"
            className="touch-target flex items-center justify-center rounded-full p-2 active:bg-gray-200/60"
            aria-label="Ayuda"
          >
            <HelpIcon />
          </button>
        </div>
      </main>
    </div>
  )
}
