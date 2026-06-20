export default function MobileLayout({ children }) {
  return (
    <div className="mobile-shell">
      <div className="mobile-frame">{children}</div>
    </div>
  )
}
