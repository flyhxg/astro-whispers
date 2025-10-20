import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'

const links = [
  { name: '首页', to: '/' },
  { name: '我的仪表盘', to: '/dashboard' },
  { name: '星座报告', to: '/reports/astrology' },
  { name: '生肖命理', to: '/reports/zodiac' },
  { name: '玄学文章', to: '/articles' }
]

export default function Navbar() {
  return (
    <Disclosure as="nav" className="fixed left-0 right-0 top-0 z-40 bg-night/60 backdrop-blur-xl">
      {({ open }) => (
        <>
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-serif font-semibold tracking-widest text-aurora">
                AstroWhispers
              </Link>
              <div className="hidden gap-2 md:flex">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      clsx(
                        'rounded-full px-4 py-2 text-sm font-medium transition',
                        isActive ? 'bg-white/15 text-white shadow-glow' : 'text-white/70 hover:bg-white/10 hover:text-white'
                      )
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Link to="/login" className="text-sm text-white/70 hover:text-white">登录</Link>
              <Link to="/register" className="btn-primary">注册体验</Link>
            </div>
            <div className="flex md:hidden">
              <Disclosure.Button className="inline-flex items-center justify-center rounded-full p-2 text-white hover:bg-white/10 focus:outline-none">
                <span className="sr-only">Open main menu</span>
                {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </Disclosure.Button>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-4 pb-4 pt-2">
              {links.map((link) => (
                <Disclosure.Button
                  key={link.to}
                  as={NavLink}
                  to={link.to}
                  className={({ isActive }) =>
                    clsx(
                      'block rounded-lg px-4 py-2 text-base font-medium',
                      isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    )
                  }
                >
                  {link.name}
                </Disclosure.Button>
              ))}
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="flex-1 rounded-lg bg-white/10 py-2 text-center text-sm text-white/80">登录</Link>
                <Link to="/register" className="flex-1 rounded-lg bg-aurora py-2 text-center text-sm text-night">注册体验</Link>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

