import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import { ArrowRightIcon } from './icons'

const MOUNTAIN_BG =
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1920&q=80'

const COUNTRIES = [
  'Perú',
  'Argentina',
  'Bolivia',
  'Brasil',
  'Chile',
  'Colombia',
  'Ecuador',
  'Estados Unidos',
  'España',
  'México',
  'Otro',
]

const LANGUAGES = ['Español', 'English', 'Quechua']

const INTERESTS = [
  {
    id: 'arqueologia',
    label: 'Arqueología',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
      </svg>
    ),
  },
  {
    id: 'gastronomia',
    label: 'Gastronomía',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38v-1.5m-12 1.5v-1.5" />
      </svg>
    ),
  },
  {
    id: 'naturaleza',
    label: 'Naturaleza',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    id: 'artesania',
    label: 'Artesanía',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    id: 'aventura',
    label: 'Aventura',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  },
]

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }

  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

function FieldLabel({ children }) {
  return (
    <label
      className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-gray-500"
      style={{ fontFamily: 'var(--font-serif)' }}
    >
      {children}
    </label>
  )
}

function FooterDivider() {
  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <div className="h-px w-16 bg-gray-300" />
      <div className="flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gray-400" />
        <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gray-400" />
        <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gray-400" />
      </div>
      <div className="h-px w-16 bg-gray-300" />
    </div>
  )
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [language, setLanguage] = useState('Español')
  const [interests, setInterests] = useState(['arqueologia'])

  const toggleInterest = (id) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const inputClass =
    'touch-target w-full rounded-xl border border-inka-border bg-white px-4 text-base text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-inka-green focus:ring-2 focus:ring-inka-green/10'

  return (
    <div className="relative min-h-full bg-[#f4f5f7]">
      <Navbar linkTo="/login" linkText="Iniciar Sesión" showLogo />

      <div className="pointer-events-none absolute inset-0 min-h-full overflow-hidden">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat blur-sm"
          style={{ backgroundImage: `url("${MOUNTAIN_BG}")` }}
        />
        <div className="absolute inset-0 bg-white/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/75 to-[#f4f5f7]" />
      </div>

      <main className="safe-bottom relative z-10 px-4 py-5 pb-10">
        <div className="w-full rounded-2xl border border-white/80 bg-white px-5 py-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          <div className="mb-6 text-center">
            <h1
              className="text-[1.65rem] font-bold leading-tight text-inka-green"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Comienza tu viaje
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
              Únete a la plataforma de voz que da vida a la historia del Perú.
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <FieldLabel>Nombre completo</FieldLabel>
              <input
                id="name"
                type="text"
                placeholder="Ej. Juan Pérez"
                className={inputClass}
              />
            </div>

            <div>
              <FieldLabel>Correo electrónico</FieldLabel>
              <input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                className={inputClass}
              />
            </div>

            <div>
              <FieldLabel>Contraseña</FieldLabel>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 transition hover:text-gray-600"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div>
              <FieldLabel>País de origen</FieldLabel>
              <div className="relative">
                <select
                  id="country"
                  defaultValue=""
                  className={`${inputClass} appearance-none pr-10`}
                >
                  <option value="" disabled>
                    Selecciona tu país
                  </option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <FieldLabel>Idioma preferido</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.slice(0, 2).map((lang) => {
                  const selected = language === lang
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`touch-target flex items-center gap-2 rounded-xl border px-3 text-sm transition active:scale-[0.98] ${
                        selected
                          ? 'border-inka-green/20 bg-gray-100 text-gray-800'
                          : 'border-inka-border bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                          selected ? 'border-inka-green' : 'border-gray-300'
                        }`}
                      >
                        {selected && <span className="h-2 w-2 rounded-full bg-inka-green" />}
                      </span>
                      {lang}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setLanguage('Quechua')}
                  className={`touch-target col-span-2 flex items-center gap-2 rounded-xl border px-3 text-sm transition active:scale-[0.98] ${
                    language === 'Quechua'
                      ? 'border-inka-green/20 bg-gray-100 text-gray-800'
                      : 'border-inka-border bg-gray-50 text-gray-600'
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      language === 'Quechua' ? 'border-inka-green' : 'border-gray-300'
                    }`}
                  >
                    {language === 'Quechua' && <span className="h-2 w-2 rounded-full bg-inka-green" />}
                  </span>
                  Quechua
                </button>
              </div>
            </div>

            <div>
              <FieldLabel>Intereses turísticos</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {INTERESTS.map(({ id, label, icon }) => {
                  const selected = interests.includes(id)
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleInterest(id)}
                      className={`touch-target flex items-center justify-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition active:scale-[0.98] ${
                        selected
                          ? 'border-inka-green bg-inka-green text-white'
                          : 'border-inka-border bg-white text-gray-600'
                      } ${id === 'aventura' ? 'col-span-2' : ''}`}
                    >
                      {icon}
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="submit"
              className="touch-target mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-inka-green py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition active:scale-[0.98]"
            >
              Crear cuenta
              <ArrowRightIcon />
            </button>
          </form>

          <p className="mt-5 text-center text-[13px] leading-relaxed text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="font-semibold text-inka-gold transition hover:text-inka-gold/80"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <FooterDivider />

        <p
          className="mt-3 px-2 pb-2 text-center text-[11px] leading-relaxed text-gray-500"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          © 2024 InkaVoice • Un viaje a través de la herencia cultural del Perú
        </p>
      </main>
    </div>
  )
}
