'use client';

import React, { useState, useEffect } from 'react';
import { Viewer } from './Viewer';
import { useConfiguratorStore } from '@/store/configuratorStore';
import { Box, Image as ImageIcon, Sparkles, ZoomIn } from 'lucide-react';

interface MediaItem {
  id: string;
  type: '3d' | 'image';
  label: string;
  url?: string;
  sublabel?: string;
}

interface ProductMediaGalleryProps {
  glbUrl?: string;
  thumbnailUrl?: string | null;
  imageWhite?: string | null;
  imageYellow?: string | null;
  imageRose?: string | null;
  galleryUrls?: string[];
  productName: string;
}

export function ProductMediaGallery({
  glbUrl,
  thumbnailUrl,
  imageWhite,
  imageYellow,
  imageRose,
  galleryUrls = [],
  productName,
}: ProductMediaGalleryProps) {
  const currentMetal = useConfiguratorStore((state) => state.metal);

  // Build the list of available media items
  const mediaItems: MediaItem[] = [];

  // 1. 3D Model
  if (glbUrl) {
    mediaItems.push({
      id: '3d',
      type: '3d',
      label: '3D View',
      sublabel: 'Interactive',
    });
  }

  // 2. White Gold Image
  if (imageWhite) {
    mediaItems.push({
      id: 'white',
      type: 'image',
      label: 'White Gold',
      sublabel: '14W / 18W / Platinum',
      url: imageWhite,
    });
  }

  // 3. Yellow Gold Image
  if (imageYellow) {
    mediaItems.push({
      id: 'yellow',
      type: 'image',
      label: 'Yellow Gold',
      sublabel: '14Y / 18Y',
      url: imageYellow,
    });
  }

  // 4. Rose Gold Image
  if (imageRose) {
    mediaItems.push({
      id: 'rose',
      type: 'image',
      label: 'Rose Gold',
      sublabel: '14R / 18R',
      url: imageRose,
    });
  }

  // 5. Primary Thumbnail (if distinct from metal images)
  if (
    thumbnailUrl &&
    thumbnailUrl !== imageWhite &&
    thumbnailUrl !== imageYellow &&
    thumbnailUrl !== imageRose
  ) {
    mediaItems.push({
      id: 'thumbnail',
      type: 'image',
      label: 'Cover Render',
      sublabel: 'Studio',
      url: thumbnailUrl,
    });
  }

  // 6. Additional Gallery Images
  galleryUrls.forEach((url, index) => {
    if (
      url !== imageWhite &&
      url !== imageYellow &&
      url !== imageRose &&
      url !== thumbnailUrl
    ) {
      mediaItems.push({
        id: `gallery-${index}`,
        type: 'image',
        label: `View ${index + 1}`,
        sublabel: 'Gallery',
        url,
      });
    }
  });

  // Active media item state
  const [activeId, setActiveId] = useState<string>(
    mediaItems.length > 0 ? mediaItems[0].id : '3d'
  );

  // When customer changes metal in configurator:
  // If the customer is viewing photo renders, automatically sync to the matching metal image if available
  useEffect(() => {
    if (activeId !== '3d') {
      if ((currentMetal === '14W' || currentMetal === '18W') && imageWhite) {
        setActiveId('white');
      } else if ((currentMetal === '14Y' || currentMetal === '18Y') && imageYellow) {
        setActiveId('yellow');
      } else if ((currentMetal === '14R' || currentMetal === '18R') && imageRose) {
        setActiveId('rose');
      }
    }
  }, [currentMetal, imageWhite, imageYellow, imageRose, activeId]);

  const activeItem = mediaItems.find((m) => m.id === activeId) || mediaItems[0];
  const is3DActive = activeItem?.type === '3d';

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Media Stage */}
      <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-[#f8f8f8] rounded-2xl overflow-hidden relative border border-gray-100/80 shadow-sm group">
        {/* Floating Mode Switcher Badge */}
        {mediaItems.length > 1 && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-gray-200/60 text-xs font-semibold text-gray-700">
            {is3DActive ? (
              <span className="flex items-center gap-1.5 text-[#163f35]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Interactive 3D View
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-gray-700">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                {activeItem?.label || 'Photo Render'}
              </span>
            )}
          </div>
        )}

        {/* Quick 3D / Photo Toggle Shortcut Button */}
        {glbUrl && mediaItems.some((m) => m.type === 'image') && (
          <div className="absolute top-4 right-4 z-20">
            {is3DActive ? (
              <button
                type="button"
                onClick={() => {
                  const firstImg = mediaItems.find((m) => m.type === 'image');
                  if (firstImg) setActiveId(firstImg.id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-[#163f35] text-xs font-bold shadow-sm border border-gray-200/80 transition-all cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" /> View Photo Renders
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveId('3d')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#163f35] hover:bg-[#0f2c25] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Box className="w-3.5 h-3.5 text-emerald-400" /> Switch to 3D
              </button>
            )}
          </div>
        )}

        {/* 3D Viewer Canvas - Keep mounted in DOM so WebGL context doesn't re-instantiate */}
        {glbUrl && (
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: is3DActive ? 1 : 0,
              pointerEvents: is3DActive ? 'auto' : 'none',
              zIndex: is3DActive ? 10 : 0,
            }}
          >
            <Viewer glbUrl={glbUrl} />
          </div>
        )}

        {/* 2D Photo Render View */}
        {!is3DActive && activeItem?.url && (
          <div className="absolute inset-0 flex items-center justify-center p-8 z-10 animate-in fade-in duration-300">
            <img
              src={activeItem.url}
              alt={`${productName} - ${activeItem.label}`}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}

        {/* Hint Pill at the bottom */}
        {is3DActive && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/85 backdrop-blur-sm px-3.5 py-1 rounded-full text-[11px] font-medium text-gray-500 border border-gray-200/60 shadow-xs flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#163f35]" /> Drag to rotate &bull; Scroll to zoom
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails Gallery Strip */}
      {mediaItems.length > 1 && (
        <div className="w-full flex items-center gap-3 overflow-x-auto py-1 scrollbar-thin">
          {mediaItems.map((item) => {
            const isSelected = activeId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={`relative shrink-0 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer overflow-hidden p-1.5 ${
                  isSelected
                    ? 'ring-2 ring-[#163f35] bg-white shadow-sm border border-[#163f35]'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200/80 opacity-85 hover:opacity-100'
                }`}
                style={{ width: '84px', height: '84px' }}
                title={`${item.label} (${item.sublabel || ''})`}
              >
                {item.type === '3d' ? (
                  <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg text-white">
                    <Box className="w-6 h-6 text-emerald-400 mb-1" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                      3D
                    </span>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-white rounded-lg overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.label}
                      className="w-full h-full object-contain mix-blend-multiply p-1"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold text-center py-0.5 truncate px-1">
                      {item.label}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
