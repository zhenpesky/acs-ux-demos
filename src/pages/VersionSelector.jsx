import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import { ArrowRightIcon, BookOpenIcon } from '@patternfly/react-icons';
import RHACSLogo from '../assets/RHACS-Logo.svg?react';
import '../styles/landing.css';

function rand(min, max) {
  return +(min + Math.random() * (max - min)).toFixed(1);
}

const PARTICLE_SYMBOLS = ['◻', 'PF6', 'Aa', '◈', 'UI', '▣', '⊞', 'Hk', '◇', '⬡', '△', '⊡'];
const PARTICLE_COLORS = [
  'rgba(110, 231, 183, 0.2)',
  'rgba(96, 165, 250, 0.22)',
  'rgba(201, 25, 11, 0.17)',
  'rgba(96, 165, 250, 0.22)',
  'rgba(110, 231, 183, 0.2)',
  'rgba(96, 165, 250, 0.22)',
  'rgba(251, 191, 36, 0.17)',
  'rgba(96, 165, 250, 0.22)',
  'rgba(201, 25, 11, 0.17)',
  'rgba(96, 165, 250, 0.22)',
  'rgba(110, 231, 183, 0.2)',
  'rgba(96, 165, 250, 0.22)',
];

const versions = [
  {
    id: 'v1',
    variant: 'v1',
    version: 'Version 01',
    title: 'MVP — Collection Scope',
    badges: [
      { label: 'MVP', color: 'blue' },
      { label: 'Current', color: 'green' },
    ],
    description:
      'The initial prototype with the complete StackRox UI, saved filters with collections, compound search filters, and the 5-step reporting wizard using collection-based resource scoping.',
    features: [
      'Saved filter management',
      'Collection-based resource scoping',
      'Compound entity-attribute filters',
      '5-step report creation wizard',
    ],
    path: '/v1/main/dashboard',
  },
  {
    id: 'v2',
    variant: 'v2',
    version: 'Version 02',
    title: 'Saved Filter Iteration',
    badges: [
      { label: 'Iteration 5', color: 'red' },
      { label: 'New', color: 'orange' },
    ],
    description:
      'Updated Figma iteration replacing collections with saved filter-based scoping. Features redesigned manage filters modal, "Reports & Saved Views" with 4 tabs, and custom filter scope.',
    features: [
      'Saved filter-based resource scoping',
      'Redesigned manage filters modal',
      'Reports & Saved Views (4 tabs)',
      'Custom filters + saved filter scope',
    ],
    path: '/v2/main/dashboard',
  },
  {
    id: 'v3',
    variant: 'v3',
    version: 'Version 03',
    title: 'MVP — Custom Filters',
    badges: [
      { label: 'MVP', color: 'green' },
      { label: 'New', color: 'orange' },
    ],
    description:
      'MVP iteration with Collection and Custom Filters as scope methods in the wizard. Saved filters remain on the results view and carry over to the wizard as custom filters.',
    features: [
      'Collection-based resource scoping',
      'Custom filters scope method',
      'Saved filters on results view carry over',
      '5-step report creation wizard',
    ],
    path: '/v3/main/dashboard',
  },
];

export default function VersionSelector() {
  const navigate = useNavigate();

  const motion = useMemo(() => ({
    panelLeft: { '--f-dur': `${rand(12, 18)}s`, '--f-delay': `${rand(1.2, 2.5)}s` },
    panelRight: { '--f-dur': `${rand(10, 16)}s`, '--f-delay': `${rand(1.5, 3)}s` },
    palette: { '--f-dur': `${rand(14, 22)}s`, '--f-delay': `${rand(1.2, 2.5)}s` },
    artboard: { '--f-dur': `${rand(10, 16)}s`, '--f-delay': `${rand(1.5, 3)}s` },
    cursorL: { '--f-dur': `${rand(8, 14)}s`, '--f-delay': `${rand(1.5, 3)}s` },
    cursorR: { '--f-dur': `${rand(10, 16)}s`, '--f-delay': `${rand(1.5, 3)}s` },
    layers: { '--f-dur': `${rand(12, 20)}s`, '--f-delay': `${rand(1.5, 3)}s` },
    orbs: Array.from({ length: 5 }, () => ({
      '--f-dur': `${rand(14, 26)}s`,
      '--f-delay': `${rand(0.8, 3)}s`,
    })),
    particles: PARTICLE_SYMBOLS.map((_, i) => ({
      left: `${rand(5, 93)}%`,
      animationDuration: `${rand(12, 28)}s`,
      animationDelay: `${rand(0, 12)}s`,
      color: PARTICLE_COLORS[i],
    })),
  }), []);

  return (
    <div className="landing-root">
      <div className="landing-bg" />
      <div className="landing-grid-overlay" />

      <div className="glass-scene" aria-hidden="true">
        <div className="glass-panel glass-panel--left" style={motion.panelLeft}>
          <div className="glass-wireframe">
            <span className="gw-header" />
            <div className="gw-body">
              <span className="gw-sidebar" />
              <div className="gw-content">
                <span className="gw-line gw-line--title" />
                <span className="gw-line" />
                <span className="gw-line gw-line--short" />
                <div className="gw-cards"><span /><span /><span /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-palette" style={motion.palette}>
          <div className="glass-palette-hole" />
          <span className="gp-dot gp-dot--1" />
          <span className="gp-dot gp-dot--2" />
          <span className="gp-dot gp-dot--3" />
          <span className="gp-dot gp-dot--4" />
          <span className="gp-dot gp-dot--5" />
          <span className="gp-dot gp-dot--6" />
        </div>

        <div className="glass-panel glass-panel--right" style={motion.panelRight}>
          <div className="glass-type">
            <span className="gt gt--h1">Aa</span>
            <span className="gt-line gt-line--lg" />
            <span className="gt-line gt-line--md" />
            <span className="gt-line gt-line--sm" />
            <span className="gt-line gt-line--xs" />
          </div>
        </div>

        <div className="glass-artboard" style={motion.artboard}>
          <div className="glass-artboard-frame">
            <span className="ga-handle ga-handle--tl" />
            <span className="ga-handle ga-handle--tr" />
            <span className="ga-handle ga-handle--bl" />
            <span className="ga-handle ga-handle--br" />
            <span className="ga-crosshair ga-crosshair--h" />
            <span className="ga-crosshair ga-crosshair--v" />
          </div>
          <span className="ga-label">Artboard 1</span>
          <div className="ga-glow" />
        </div>

        {/* Pen tool with bezier curve */}
        <div className="glass-pen" style={motion.cursorL}>
          <svg viewBox="0 0 64 64" fill="none">
            <path d="M12 52 C 20 20, 44 20, 52 52" stroke="rgba(96,165,250,0.35)" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
            <line x1="12" y1="52" x2="20" y2="20" stroke="rgba(96,165,250,0.2)" strokeWidth="1" />
            <line x1="52" y1="52" x2="44" y2="20" stroke="rgba(96,165,250,0.2)" strokeWidth="1" />
            <circle cx="12" cy="52" r="3.5" fill="rgba(96,165,250,0.5)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <circle cx="52" cy="52" r="3.5" fill="rgba(96,165,250,0.5)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <rect x="16" y="16" width="8" height="8" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <rect x="40" y="16" width="8" height="8" rx="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          </svg>
        </div>
        {/* Color swatch card */}
        <div className="glass-swatch" style={motion.cursorR}>
          <div className="gs-color gs-color--1" />
          <div className="gs-color gs-color--2" />
          <div className="gs-color gs-color--3" />
          <div className="gs-label-bar" />
        </div>

        <div className="glass-layers" style={motion.layers}>
          <div className="glass-layer glass-layer--1"><span className="gl-icon" /><span className="gl-name" /><span className="gl-eye" /></div>
          <div className="glass-layer glass-layer--2"><span className="gl-icon" /><span className="gl-name" /><span className="gl-eye" /></div>
          <div className="glass-layer glass-layer--3"><span className="gl-icon" /><span className="gl-name gl-name--active" /><span className="gl-eye" /></div>
          <div className="glass-layer glass-layer--4"><span className="gl-icon" /><span className="gl-name" /><span className="gl-eye gl-eye--off" /></div>
        </div>

        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`glass-orb glass-orb--${i}`} style={motion.orbs[i - 1]} />
        ))}

        <div className="glass-particles">
          {PARTICLE_SYMBOLS.map((char, i) => (
            <span key={i} className="gp" style={motion.particles[i]}>{char}</span>
          ))}
        </div>
      </div>

      <div className="landing-content">
        {/* Top bar */}
        <div className="landing-topbar">
          <div className="landing-topbar-brand">
            <RHACSLogo
              className="landing-topbar-logo"
              aria-label="Red Hat Advanced Cluster Security"
              role="img"
            />
            <div className="landing-topbar-divider" />
            <span className="landing-topbar-text">Prototype Lab</span>
          </div>
          <div className="landing-topbar-actions">
            <Button
              variant="secondary"
              className="landing-guide-btn"
              icon={<BookOpenIcon />}
              onClick={() => navigate('/guide')}
            >
              Getting Started Guide
            </Button>
          </div>
        </div>

        {/* Hero */}
        <div className="landing-hero">
          <div className="landing-hero-tag">
            <span className="landing-hero-tag-dot" />
            HPUX-1160 Design Iterations
          </div>
          <h1>
            ACS Prototype <span>Iterations</span>
          </h1>
          <p className="landing-hero-description">
            Explore vulnerability reporting workflow prototypes. Each version represents
            a design iteration with different interaction patterns and scoping methods.
          </p>
        </div>

        {/* Version cards */}
        <div className="landing-cards">
          {versions.map((v) => (
            <div
              key={v.id}
              className={`landing-card landing-card--${v.variant}`}
              onClick={() => navigate(v.path)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(v.path)}
            >
              <div className="landing-card-glow" />
              <div className="landing-card-accent" />
              <div className="landing-card-inner">
                <div className="landing-card-head">
                  <span className="landing-card-version">{v.version}</span>
                  <div className="landing-card-badges">
                    {v.badges.map((b) => (
                      <span key={b.label} className={`landing-card-badge landing-card-badge--${b.color}`}>
                        {b.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="landing-card-title">{v.title}</div>
                <p className="landing-card-desc">{v.description}</p>
                <ul className="landing-card-features">
                  {v.features.map((f) => (
                    <li key={f}>
                      <span className="feature-dot" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="landing-card-action">
                  <div className="landing-card-launch">
                    Launch {v.id.toUpperCase()}
                    <span className="landing-card-launch-arrow">
                      <ArrowRightIcon style={{ color: 'rgba(255,255,255,0.7)' }} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="landing-footer">
          <div className="landing-footer-text">
            Red Hat User Experience Design &middot; Confidential
          </div>
          <div className="landing-footer-divider" />
        </div>
      </div>
    </div>
  );
}
