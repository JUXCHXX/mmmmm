import React from 'react';

/**
 * SkipLink Component
 * Allows keyboard users to skip to main content
 */

interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  label = 'Saltar al contenido principal',
}) => {
  return (
    <a href={`#${targetId}`} className="skip-link sr-only-focusable">
      {label}
    </a>
  );
};

SkipLink.displayName = 'SkipLink';

/**
 * Main content wrapper - used with SkipLink
 */
interface MainContentProps {
  children: React.ReactNode;
  id?: string;
  role?: string;
  tabIndex?: number;
}

export const MainContent: React.FC<MainContentProps> = ({
  children,
  id = 'main-content',
  role = 'main',
  tabIndex = -1,
}) => {
  return (
    <main id={id} role={role} tabIndex={tabIndex}>
      {children}
    </main>
  );
};

MainContent.displayName = 'MainContent';

/**
 * Keyboard Navigation Handler
 * Detects keyboard vs mouse input for better focus management
 */
export const useKeyboardNavigation = () => {
  React.useEffect(() => {
    const handleKeyDown = () => {
      document.body.classList.add('keyboard-user');
      document.body.classList.remove('mouse-user');
    };

    const handleMouseDown = () => {
      document.body.classList.add('mouse-user');
      document.body.classList.remove('keyboard-user');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
};

export default {
  SkipLink,
  MainContent,
  useKeyboardNavigation,
};
