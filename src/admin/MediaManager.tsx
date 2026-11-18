import React from 'react';
import { Upload, Video, Sparkles, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { ProceduralTheme } from '../types/store';

interface ThemeOption {
  id: ProceduralTheme;
  label: string;
  swatch: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  { id: 'criollo', label: 'Criollo Cacao', swatch: '#4A2C1D' },
  { id: 'vanilla', label: 'Bourbon Vanilla', swatch: '#EAE0D0' },
  { id: 'pistachio', label: 'Bronte Pistachio', swatch: '#7B8F5E' },
];

export default function MediaManager() {
  const {
    heroMedia,
    customVideoUrl,
    uploadHeroVideo,
    resetHeroToProcedural,
    updateHeroCopy,
  } = useStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      uploadHeroVideo(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-medium text-espresso">
          Hero Media &amp; Scroll Canvas Manager
        </h2>
        <p className="mt-1 text-sm text-taupe">
          Upload a custom <code className="rounded bg-cream px-1">.mp4</code>{' '}
          to scrub on scroll, or select a procedural canvas palette.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-espresso/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Video className="h-5 w-5 text-gold" />
            <h3 className="font-serif text-2xl font-medium">
              Custom .MP4 Scroll Video
            </h3>
          </div>
          <p className="mt-2 text-sm text-taupe">
            When active, the Home page 450vh scroll container smoothly scrubs
            through your uploaded video frames using{' '}
            <code>requestAnimationFrame</code>.
          </p>

          <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-espresso/20 bg-cream/40 p-8 text-center transition hover:border-gold">
            <Upload className="h-8 w-8 text-gold" />
            <span className="mt-3 text-sm font-semibold text-espresso">
              Click to select local .mp4 file
            </span>
            <span className="mt-1 text-xs text-taupe">
              {heroMedia.mode === 'video' && customVideoUrl
                ? `Active: ${heroMedia.customVideoName}`
                : 'Recommended: 16:9 high-bitrate MP4'}
            </span>
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {heroMedia.mode === 'video' && (
            <button
              type="button"
              onClick={() => resetHeroToProcedural('criollo')}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-espresso/20 px-4 py-2 text-xs font-semibold text-espresso hover:border-espresso"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Revert to Procedural Canvas Sequence
            </button>
          )}
        </div>

        <div className="space-y-6 rounded-2xl border border-espresso/10 bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-gold" />
              <h3 className="font-serif text-2xl font-medium">
                Procedural Canvas Palette
              </h3>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {THEME_OPTIONS.map((theme) => (
                <button
                  type="button"
                  key={theme.id}
                  onClick={() => resetHeroToProcedural(theme.id)}
                  className={`rounded-xl border p-3 text-left transition ${
                    heroMedia.mode === 'procedural' &&
                    heroMedia.proceduralTheme === theme.id
                      ? 'border-espresso bg-cream font-semibold'
                      : 'border-espresso/10 hover:border-gold'
                  }`}
                >
                  <span
                    className="mb-2 block h-6 w-full rounded-md border border-espresso/10"
                    style={{ backgroundColor: theme.swatch }}
                  />
                  <span className="text-xs text-espresso">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-espresso/10 pt-5">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-taupe">
              Hero Headline &amp; Tagline
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                value={heroMedia.posterHeadline}
                onChange={(e) =>
                  updateHeroCopy({ posterHeadline: e.target.value })
                }
                placeholder="Hero Headline"
                className="w-full rounded-xl border border-espresso/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
              />
              <input
                type="text"
                value={heroMedia.heroTagline}
                onChange={(e) =>
                  updateHeroCopy({ heroTagline: e.target.value })
                }
                placeholder="Hero Tagline"
                className="w-full rounded-xl border border-espresso/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
