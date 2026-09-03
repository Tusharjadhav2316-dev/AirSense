import React from 'react';
import { Sparkles, Baby, Heart } from 'lucide-react';
import type { HealthProfile } from '../../types';

interface HealthProfilePickerProps {
  selectedProfile: HealthProfile;
  onSelect: (profile: HealthProfile) => void;
}

export const HealthProfilePicker: React.FC<HealthProfilePickerProps> = ({
  selectedProfile,
  onSelect,
}) => {
  const options: {
    id: HealthProfile;
    label: string;
    desc: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      id: 'none',
      label: 'None',
      desc: 'General advice',
      icon: Sparkles,
    },
    {
      id: 'asthma',
      label: 'Asthma',
      desc: 'Sensitive to pollution',
      // Custom lungs / respiratory icon
      icon: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4v7" />
          <path d="M12 11a5 5 0 0 0-5 5v2a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3v-7" />
          <path d="M12 11a5 5 0 0 1 5 5v2a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3v-7" />
        </svg>
      ),
    },
    {
      id: 'elderly',
      label: 'Elderly',
      desc: '65+',
      icon: Heart,
    },
    {
      id: 'child',
      label: 'Child',
      desc: '< 12',
      icon: Baby,
    },
  ];

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-800 mb-1.5 font-sans">
        Your health profile <span className="text-slate-400 font-normal">(optional)</span>
      </label>

      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedProfile === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-center select-none ${
                isSelected
                  ? 'bg-blue-50/90 border-[#2563EB] text-[#1D4ED8] ring-2 ring-[#2563EB]/25 shadow-xs font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className={`w-6 h-6 flex items-center justify-center mb-1 ${isSelected ? 'text-[#2563EB]' : 'text-slate-500'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold block leading-tight tracking-tight">
                {opt.label}
              </span>
              <span className={`text-[10px] block leading-tight mt-0.5 truncate max-w-full ${isSelected ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                {opt.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
