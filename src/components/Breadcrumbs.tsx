import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 px-6 py-4 max-w-7xl mx-auto w-full">
      <Link 
        to="/" 
        className="text-[10px] font-bold uppercase tracking-widest text-brand-lilac/40 hover:text-brand-lilac transition-colors"
      >
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <React.Fragment key={name}>
            <ChevronRight size={10} className="text-brand-lilac/20" />
            {isLast ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-lilac">
                {displayName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="text-[10px] font-bold uppercase tracking-widest text-brand-lilac/40 hover:text-brand-lilac transition-colors"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
