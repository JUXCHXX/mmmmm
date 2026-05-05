import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { getModulesForRole } from '@/types/modules';
import { LogOut, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  MODULE_ICON_MAP,
  SIDEBAR_SECTIONS,
  getSidebarModuleLabel,
  type SidebarSectionId,
} from './sidebarConfig';

const BAR_HEIGHT = 64;
const CURVE_DURATION_MS = 300;
const ICON_PHASE_MS = 150;
const CURVE_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

const NEWTON_ITERATIONS = 4;
const NEWTON_MIN_SLOPE = 0.001;
const SUBDIVISION_PRECISION = 0.0000001;
const SUBDIVISION_MAX_ITERATIONS = 10;
const SPLINE_TABLE_SIZE = 11;
const SAMPLE_STEP_SIZE = 1 / (SPLINE_TABLE_SIZE - 1);

const A = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1;
const B = (a1: number, a2: number) => 3 * a2 - 6 * a1;
const C = (a1: number) => 3 * a1;

const calcBezier = (t: number, a1: number, a2: number) =>
  ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t;

const getSlope = (t: number, a1: number, a2: number) =>
  3 * A(a1, a2) * t * t + 2 * B(a1, a2) * t + C(a1);

const binarySubdivide = (x: number, a: number, b: number, x1: number, x2: number) => {
  let start = a;
  let end = b;

  for (let i = 0; i < SUBDIVISION_MAX_ITERATIONS; i += 1) {
    const current = start + (end - start) / 2;
    const currentX = calcBezier(current, x1, x2) - x;

    if (Math.abs(currentX) <= SUBDIVISION_PRECISION) {
      return current;
    }

    if (currentX > 0) {
      end = current;
    } else {
      start = current;
    }
  }

  return start + (end - start) / 2;
};

const newtonRaphsonIterate = (x: number, guessT: number, x1: number, x2: number) => {
  let t = guessT;

  for (let i = 0; i < NEWTON_ITERATIONS; i += 1) {
    const slope = getSlope(t, x1, x2);

    if (slope === 0) {
      return t;
    }

    const currentX = calcBezier(t, x1, x2) - x;
    t -= currentX / slope;
  }

  return t;
};

const createBezierEasing = (x1: number, y1: number, x2: number, y2: number) => {
  if (x1 === y1 && x2 === y2) {
    return (t: number) => t;
  }

  const sampleValues = new Float32Array(SPLINE_TABLE_SIZE);

  for (let i = 0; i < SPLINE_TABLE_SIZE; i += 1) {
    sampleValues[i] = calcBezier(i * SAMPLE_STEP_SIZE, x1, x2);
  }

  const getTForX = (x: number) => {
    let intervalStart = 0;
    let currentSample = 1;
    const lastSample = SPLINE_TABLE_SIZE - 1;

    while (currentSample !== lastSample && sampleValues[currentSample] <= x) {
      intervalStart += SAMPLE_STEP_SIZE;
      currentSample += 1;
    }

    currentSample -= 1;

    const dist =
      (x - sampleValues[currentSample]) /
      (sampleValues[currentSample + 1] - sampleValues[currentSample]);

    const guessForT = intervalStart + dist * SAMPLE_STEP_SIZE;
    const initialSlope = getSlope(guessForT, x1, x2);

    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(x, guessForT, x1, x2);
    }

    if (initialSlope === 0) {
      return guessForT;
    }

    return binarySubdivide(x, intervalStart, intervalStart + SAMPLE_STEP_SIZE, x1, x2);
  };

  return (x: number) => calcBezier(getTForX(x), y1, y2);
};

const easeStandard = createBezierEasing(0.4, 0, 0.2, 1);

const getCurvePath = (cx: number, barWidth: number, barHeight: number) => {
  if (barWidth <= 0) {
    return 'M0,0 L0,64 Z';
  }

  const r = 35;
  const minCx = r + 12;
  const maxCx = barWidth - (r + 12);
  const safeCx = Math.min(maxCx, Math.max(minCx, cx));

  return `
    M0,0
    L${safeCx - r - 10},0
    Q${safeCx - r},0 ${safeCx - r + 5},-8
    Q${safeCx},-22 ${safeCx + r - 5},-8
    Q${safeCx + r},0 ${safeCx + r + 10},0
    L${barWidth},0
    L${barWidth},${barHeight}
    L0,${barHeight}
    Z
  `;
};

const BottomNav = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedSection, setExpandedSection] = useState<SidebarSectionId | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const [curveX, setCurveX] = useState(0);
  const [displayedActiveIndex, setDisplayedActiveIndex] = useState(0);
  const [transitionState, setTransitionState] = useState<{ from: number; to: number } | null>(null);

  const navRef = useRef<HTMLElement | null>(null);
  const curveXRef = useRef(0);
  const displayedActiveIndexRef = useRef(0);
  const transitionStateRef = useRef<{ from: number; to: number } | null>(null);
  const curveAnimationRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const modules = useMemo(() => getModulesForRole(user?.roleId || ''), [user]);

  const sections = useMemo(() => {
    if (!user) return [];

    const userModules =
      user.roleId === 'super_admin'
        ? modules.filter((m) => !['properties', 'knowledge', 'audit'].includes(m.id))
        : modules;

    return SIDEBAR_SECTIONS.map((section) => ({
      ...section,
      sectionModules: section.modules
        .map((moduleId) => userModules.find((module) => module.id === moduleId))
        .filter(Boolean) as typeof userModules[number][],
    })).filter((section) => section.sectionModules.length > 0);
  }, [user, modules]);

  const routeSectionId = useMemo(() => {
    return (
      sections.find((item) =>
        item.sectionModules.some((module) => location.pathname.includes(module.path)),
      )?.id ?? null
    );
  }, [sections, location.pathname]);

  const highlightedSectionId = expandedSection || routeSectionId || sections[0]?.id || null;

  const activeSection = sections.find((section) => section.id === expandedSection);

  const targetActiveIndex = useMemo(() => {
    if (sections.length === 0) return 0;

    const index = sections.findIndex((section) => section.id === highlightedSectionId);
    return index >= 0 ? index : 0;
  }, [sections, highlightedSectionId]);

  const getCurveX = useCallback(
    (index: number, width = barWidth) => {
      if (sections.length === 0 || width <= 0) return 0;

      const cellWidth = width / sections.length;
      return cellWidth * index + cellWidth / 2;
    },
    [barWidth, sections.length],
  );

  const animateCurveTo = useCallback((targetX: number) => {
    if (curveAnimationRef.current !== null) {
      cancelAnimationFrame(curveAnimationRef.current);
      curveAnimationRef.current = null;
    }

    const fromX = curveXRef.current;

    if (Math.abs(targetX - fromX) < 0.1) {
      curveXRef.current = targetX;
      setCurveX(targetX);
      return;
    }

    const startAt = performance.now();

    const frame = (now: number) => {
      const progress = Math.min((now - startAt) / CURVE_DURATION_MS, 1);
      const eased = easeStandard(progress);
      const nextX = fromX + (targetX - fromX) * eased;

      curveXRef.current = nextX;
      setCurveX(nextX);

      if (progress < 1) {
        curveAnimationRef.current = requestAnimationFrame(frame);
      } else {
        curveAnimationRef.current = null;
      }
    };

    curveAnimationRef.current = requestAnimationFrame(frame);
  }, []);

  const closeModal = () => setExpandedSection(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSection = (sectionId: SidebarSectionId) => {
    setExpandedSection((prev) => (prev === sectionId ? null : sectionId));
  };

  useEffect(() => {
    closeModal();
  }, [location.pathname]);

  useEffect(() => {
    displayedActiveIndexRef.current = displayedActiveIndex;
  }, [displayedActiveIndex]);

  useEffect(() => {
    transitionStateRef.current = transitionState;
  }, [transitionState]);

  useEffect(() => {
    curveXRef.current = curveX;
  }, [curveX]);

  useEffect(() => {
    const node = navRef.current;
    if (!node) return;

    const updateWidth = () => {
      setBarWidth(node.getBoundingClientRect().width);
    };

    updateWidth();

    let observer: ResizeObserver | null = null;

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => updateWidth());
      observer.observe(node);
    }

    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
      observer?.disconnect();
    };
  }, [sections.length]);

  useEffect(() => {
    if (sections.length === 0 || barWidth <= 0) return;

    const targetX = getCurveX(targetActiveIndex, barWidth);

    if (!initializedRef.current) {
      initializedRef.current = true;
      setDisplayedActiveIndex(targetActiveIndex);
      displayedActiveIndexRef.current = targetActiveIndex;
      setTransitionState(null);
      transitionStateRef.current = null;
      setCurveX(targetX);
      curveXRef.current = targetX;
      return;
    }

    const fromIndex = transitionStateRef.current?.to ?? displayedActiveIndexRef.current;

    if (fromIndex === targetActiveIndex) {
      animateCurveTo(targetX);
      return;
    }

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }

    const nextTransition = { from: fromIndex, to: targetActiveIndex };
    setTransitionState(nextTransition);
    transitionStateRef.current = nextTransition;

    animateCurveTo(targetX);

    transitionTimerRef.current = setTimeout(() => {
      setDisplayedActiveIndex(targetActiveIndex);
      displayedActiveIndexRef.current = targetActiveIndex;
      setTransitionState(null);
      transitionStateRef.current = null;
      transitionTimerRef.current = null;
    }, CURVE_DURATION_MS);
  }, [sections.length, barWidth, targetActiveIndex, getCurveX, animateCurveTo]);

  useEffect(() => {
    return () => {
      if (curveAnimationRef.current !== null) {
        cancelAnimationFrame(curveAnimationRef.current);
      }

      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  if (!user || sections.length === 0) return null;

  const shouldShowModal = Boolean(expandedSection && activeSection);

  const curvePath = getCurvePath(
    curveX || getCurveX(displayedActiveIndex, Math.max(barWidth, 1)),
    Math.max(barWidth, 1),
    BAR_HEIGHT,
  );

  const getCircleStyle = (index: number) => {
    if (transitionState) {
      if (index === transitionState.from) {
        return {
          top: '0px',
          opacity: 0,
          transition: `all ${ICON_PHASE_MS}ms ${CURVE_EASE}`,
        };
      }

      if (index === transitionState.to) {
        return {
          top: '-26px',
          opacity: 1,
          transition: `all ${ICON_PHASE_MS}ms ${CURVE_EASE} ${ICON_PHASE_MS}ms`,
        };
      }
    }

    const isActive = displayedActiveIndex === index;

    return {
      top: isActive ? '-26px' : '0px',
      opacity: isActive ? 1 : 0,
      transition: `all ${ICON_PHASE_MS}ms ${CURVE_EASE}`,
    };
  };

  const getInactiveIconStyle = (index: number) => {
    if (transitionState) {
      if (index === transitionState.from) {
        return {
          opacity: 1,
          transition: `opacity ${ICON_PHASE_MS}ms ${CURVE_EASE}`,
        };
      }

      if (index === transitionState.to) {
        return {
          opacity: 0,
          transition: `opacity ${ICON_PHASE_MS}ms ${CURVE_EASE} ${ICON_PHASE_MS}ms`,
        };
      }
    }

    return {
      opacity: displayedActiveIndex === index ? 0 : 1,
      transition: `opacity ${ICON_PHASE_MS}ms ${CURVE_EASE}`,
    };
  };

  const modalLayer =
    isClient && shouldShowModal
      ? createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="nav-modal-overlay"
              onClick={closeModal}
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="nav-modal"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-bold uppercase tracking-wide text-gray-900">
                  {activeSection!.label}
                </p>
                <button
                  onClick={closeModal}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                  Cerrar
                </button>
              </div>

              <div className="mb-4 max-h-[45vh] space-y-2 overflow-y-auto">
                {activeSection!.sectionModules.map((module) => {
                  const Icon =
                    MODULE_ICON_MAP[module.icon as keyof typeof MODULE_ICON_MAP] ||
                    MODULE_ICON_MAP.LayoutDashboard;
                  const label = getSidebarModuleLabel(user.roleId, module.id, module.label);

                  return (
                    <NavLink
                      key={module.id}
                      to={module.path}
                      onClick={closeModal}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-[#00B5A0] text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                      }
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <button
                onClick={handleLogout}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-700 hover:shadow-lg"
              >
                <LogOut className="h-5 w-5" />
                Cerrar Sesion
              </button>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <>
      {modalLayer}

      <nav ref={navRef} className="bottom-navbar lg:hidden">
        <svg
          className="bottom-navbar-shape"
          viewBox={`0 -22 ${Math.max(barWidth, 1)} ${BAR_HEIGHT + 22}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={curvePath} className="bottom-navbar-path" />
        </svg>

        <div className="bottom-navbar-items">
          {sections.map((section, index) => {
            const SectionIcon = section.icon;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => toggleSection(section.id)}
                className="nav-cell"
                title={section.label}
              >
                <div className="nav-icon-active" style={getCircleStyle(index)}>
                  <SectionIcon />
                </div>

                <SectionIcon className="nav-icon-inactive" style={getInactiveIconStyle(index)} />
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
