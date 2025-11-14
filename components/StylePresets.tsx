import React from 'react';

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'studio',
    name: 'Studio Pro',
    description: 'Clean, professional studio background',
    prompt: 'A professional model in a modern studio setting, wearing the provided clothing in natural lighting with a clean white background. High-end fashion photography style.',
    icon: '📸',
  },
  {
    id: 'casual',
    name: 'Lifestyle',
    description: 'Natural, everyday look',
    prompt: 'A casual model wearing the provided clothing in a bright, modern lifestyle setting with natural lighting. Relaxed, approachable atmosphere.',
    icon: '☀️',
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    description: 'Fresh outdoor environment',
    prompt: 'A model wearing the provided clothing outdoors in natural daylight with a blurred urban or nature background. Fresh, energetic vibe.',
    icon: '🌳',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'High-fashion magazine style',
    prompt: 'A fashion model wearing the provided clothing in a high-fashion editorial style with dramatic lighting and a minimalist background. Vogue-style photography.',
    icon: '✨',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Perfect for product listings',
    prompt: 'A model wearing the provided clothing on a pure white background, centered, full body shot, perfect for e-commerce product listing. Clean and simple.',
    icon: '🛍️',
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Write your own description',
    prompt: '',
    icon: '✏️',
  },
];

interface StylePresetsProps {
  selectedPreset: string;
  onSelectPreset: (presetId: string, prompt: string) => void;
}

export const StylePresets: React.FC<StylePresetsProps> = ({ selectedPreset, onSelectPreset }) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Styles</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {STYLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset.id, preset.prompt)}
            className={`text-left p-3 rounded-xl border-2 transition-all hover:shadow-md ${
              selectedPreset === preset.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-indigo-300'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-2xl">{preset.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900">{preset.name}</div>
                <div className="text-xs text-gray-500 line-clamp-1">{preset.description}</div>
              </div>
              {selectedPreset === preset.id && (
                <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
