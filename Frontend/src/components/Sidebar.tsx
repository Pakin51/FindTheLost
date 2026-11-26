import { Link, useLocation } from 'react-router';

const MENU_ITEMS = [
  { to: '/', label: 'Dashboard' },
  { to: '/my-lost', label: 'My Lost' },
  { to: '/history', label: 'History' },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  // หน้ารายละเอียด (/reports/:id) ถือว่าอยู่ในเมนู Dashboard
  const isActive = (to: string) =>
    to === '/' ? pathname === '/' || pathname.startsWith('/reports') : pathname.startsWith(to);

  return (
    <aside className="w-52 shrink-0 py-6 pr-4">
      <nav className="flex flex-col space-y-2 sticky top-20">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            aria-current={isActive(item.to) ? 'page' : undefined}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              isActive(item.to)
                ? 'bg-[#d9d9d9] text-black font-semibold'
                : 'text-gray-700 hover:bg-gray-200/60'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
