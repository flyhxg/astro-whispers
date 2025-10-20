export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-night/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
        <div>
          © {new Date().getFullYear()} AstroWhispers · 星辰秘语
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white">隐私政策</a>
          <a href="#" className="hover:text-white">使用条款</a>
          <a href="#" className="hover:text-white">联系我们</a>
        </div>
      </div>
    </footer>
  )
}

