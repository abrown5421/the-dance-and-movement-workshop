import React, { useState, useEffect } from 'react';
import { useAuthModuleEnabled } from '@inithium/store';
import { Box, Button } from '../../components';
import NavSlot from './nav-slot';
import LogoSlot from './logo-slot';
import UserSlot from './user-slot';
import NavbarSlideout from './navbar-slideout';
import { NavbarProps } from './navbar.types';

const AUTH_GATED_PAGE_KEYS = ['login', 'sign-up'];

export const Navbar: React.FC<NavbarProps> = ({
  pages,
  profilePages,
  activeUser,
  renderLink,
  onLogout,
}) => {
  const authModuleEnabled = useAuthModuleEnabled();
  const [slideoutOpen, setSlideoutOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsLargeScreen(e.matches);
    mq.addEventListener('change', handler);
    setIsLargeScreen(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const visiblePages = authModuleEnabled
    ? pages
    : pages.filter((page) => !AUTH_GATED_PAGE_KEYS.includes(page.key));

  const openSlideout = () => setSlideoutOpen(true);
  const closeSlideout = () => setSlideoutOpen(false);

  const showMainLinksInSlideout = !isLargeScreen;

  return (
    <>
      <Box 
        flex 
        justify="between" 
        align="center" 
        color="surface2" 
        overrideClassName="relative z-50 h-[72px] shadow-sm flex justify-between items-center bg-surface2 text-surface2-contrast"
      >
        <LogoSlot />

        <Box flex direction="row" align="center">
          <Box className="hidden lg:flex">
            <NavSlot pages={visiblePages} renderLink={renderLink} />
          </Box>

          <Box className="flex lg:hidden">
            {activeUser ? (
              <Box padding="sm" className="h-[72px]" flex align="center">
                <UserSlot activeUser={activeUser} onAvatarClick={openSlideout} />
              </Box>
            ) : (
              <Button
                icon="menu"
                color="primary"
                variant="ghost"
                size="md"
                rounded={false}
                onClick={openSlideout}
              />
            )}
          </Box>

          <Box className="hidden lg:flex">
            {activeUser && (
              <UserSlot activeUser={activeUser} onAvatarClick={openSlideout} />
            )}
          </Box>
        </Box>
      </Box>

      <NavbarSlideout
        mainPages={showMainLinksInSlideout ? visiblePages : []}
        profilePages={profilePages}
        isOpen={slideoutOpen}
        onClose={closeSlideout}
        activeUser={activeUser}
        renderLink={renderLink}
        onLogout={onLogout}
      />
    </>
  );
};