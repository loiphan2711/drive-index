'use client';

const GHOST_PATH =
  'M2,38 L2,16 Q2,2 16,2 Q30,2 30,16 L30,38 L25,33 L20,38 L16,33 L12,38 L7,33 Z';

const GHOSTS = ['1', '2', '3', '4'] as const;

export const PacmanBackground = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="pacman-bg__maze absolute inset-0" />
      <div className="pacman-bg__pellets absolute inset-0" />

      <div className="pacman-bg__power-pellet pacman-bg__power-pellet--tl" />
      <div className="pacman-bg__power-pellet pacman-bg__power-pellet--tr" />
      <div className="pacman-bg__power-pellet pacman-bg__power-pellet--bl" />
      <div className="pacman-bg__power-pellet pacman-bg__power-pellet--br" />

      <div className="pacman-bg__pacman" />
      <div className="pacman-bg__pacman--down" />

      {GHOSTS.map((ghost) => (
        <svg
          key={ghost}
          viewBox="0 0 32 40"
          className={`pacman-bg__ghost pacman-bg__ghost--${ghost}`}
          focusable="false"
        >
          <path d={GHOST_PATH} />
        </svg>
      ))}
    </div>
  );
};
