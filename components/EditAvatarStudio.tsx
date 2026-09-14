'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Check,
  Loader2,
  Trash2,
  Edit3,
  User,
  ShieldCheck,
  FileImage,
  ArrowRight,
  Eye,
  Gamepad2,
} from 'lucide-react';

interface EditAvatarStudioProps {
  initialAvatar?: string | null;
  initialName?: string | null;
  userEmail?: string | null;
}

const PRESET_AVATARS = [
  {
    id: 'preset-1',
    name: 'Cyberpunk Dev',
    role: 'Full-Stack Prodigy',
    path: '/avatars/presets/preset-1.svg',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'preset-2',
    name: 'Neon Robot',
    role: 'Algorithm Automator',
    path: '/avatars/presets/preset-2.svg',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'preset-3',
    name: 'Code Ninja',
    role: 'Bug Hunter',
    path: '/avatars/presets/preset-3.svg',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'preset-4',
    name: 'Frontend Wizard',
    role: 'CSS & UI Sorcerer',
    path: '/avatars/presets/preset-4.svg',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'preset-5',
    name: 'Pixel Coder',
    role: 'Retro Architect',
    path: '/avatars/presets/preset-5.svg',
    gradient: 'from-sky-400 to-indigo-600',
  },
  {
    id: 'preset-6',
    name: 'Quantum Arch',
    role: 'System Optimizer',
    path: '/avatars/presets/preset-6.svg',
    gradient: 'from-rose-500 to-amber-500',
  },
  {
    id: 'preset-7',
    name: 'Terminal Ace',
    role: 'DevOps & Shell Master',
    path: '/avatars/presets/preset-7.svg',
    gradient: 'from-teal-400 to-emerald-600',
  },
  {
    id: 'preset-8',
    name: 'AI Synthesizer',
    role: 'Neural Network Dev',
    path: '/avatars/presets/preset-8.svg',
    gradient: 'from-violet-500 to-purple-600',
  },
];

export function EditAvatarStudio({
  initialAvatar,
  initialName,
  userEmail,
}: EditAvatarStudioProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialAvatar || null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>(initialName || '');
  const [isRemoving, setIsRemoving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const processFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size cannot exceed 5MB.');
      return;
    }

    setSelectedFile(file);
    setSelectedPreset(null);
    setIsRemoving(false);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handlePresetSelect = (presetPath: string) => {
    setSelectedPreset(presetPath);
    setSelectedFile(null);
    setIsRemoving(false);
    setPreviewUrl(presetPath);
  };

  const handleUrlApply = () => {
    if (!customUrlInput.trim()) return;
    setSelectedFile(null);
    setSelectedPreset(null);
    setIsRemoving(false);
    setPreviewUrl(customUrlInput.trim());
  };

  const handleResetAvatar = () => {
    setSelectedFile(null);
    setSelectedPreset(null);
    setCustomUrlInput('');
    setPreviewUrl(null);
    setIsRemoving(true);
  };

  const handleSave = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();

      if (nameInput.trim() && nameInput.trim() !== initialName) {
        formData.append('name', nameInput.trim());
      }

      if (isRemoving) {
        formData.append('remove', 'true');
      } else if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (selectedPreset) {
        formData.append('preset', selectedPreset);
      } else if (previewUrl && previewUrl !== initialAvatar) {
        formData.append('imageUrl', previewUrl);
      }

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to update avatar');
      }

      setSuccessMsg('Avatar and profile updated successfully! Redirecting...');
      setTimeout(() => {
        router.push('/profile');
        router.refresh();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating avatar');
      setLoading(false);
    }
  };

  const initial = (nameInput || initialName || userEmail || 'U')[0]?.toUpperCase() || 'U';
  const displayName = nameInput.trim() || initialName || 'Developer';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-fade-in">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Profile</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>Profile</span>
          <span>/</span>
          <span className="text-cyan-400 font-bold">Avatar Studio</span>
        </div>
      </div>

      {/* Main Studio Title Card */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Customization Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Customize Your Avatar & Identity
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Upload your custom photo, choose from high-tech developer personas, or link a public image. Your avatar updates across all live multiplayer rooms, lobbies, and leaderboards.
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Real-Time Preview & Room Mockup (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Avatar Card */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 backdrop-blur-xl shadow-xl text-center space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                Live Preview
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Real-Time
              </span>
            </div>

            {/* Giant Circular Avatar with Ambient Aura */}
            <div className="relative mx-auto w-36 h-36 sm:w-40 sm:h-40 my-2">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-600 blur-xl opacity-40 animate-pulse pointer-events-none" />
              <div className="relative w-full h-full rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-600 p-1.5 shadow-2xl overflow-hidden">
                {previewUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={previewUrl}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover rounded-2xl bg-slate-950"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-5xl text-white bg-slate-950 rounded-2xl">
                    {initial}
                  </div>
                )}
              </div>

              {previewUrl && (
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-slate-950 border-2 border-slate-900 shadow-lg" title="Active Selection">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Identity Text */}
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-white truncate">
                {displayName}
              </h3>
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{userEmail || 'student@codequiz.dev'}</span>
              </p>
            </div>

            {/* Live Multiplayer Lobby Mockup Preview */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-indigo-400" />
                Multiplayer Room Appearance
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shrink-0 overflow-hidden">
                  {previewUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={previewUrl}
                      alt="Mini"
                      className="w-full h-full object-cover rounded-[6px]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-xs text-white bg-slate-950 rounded-[6px]">
                      {initial}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{displayName}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Ready in Arena
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                  Player
                </span>
              </div>
            </div>

            {/* Reset Button */}
            {(initialAvatar || previewUrl) && (
              <button
                type="button"
                onClick={handleResetAvatar}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset to Default Gradient Initials</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Editor Controls & Tabs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 backdrop-blur-xl shadow-xl space-y-6">
            {/* Display Name Input Section */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Display Name</span>
                <span className="text-[11px] text-slate-500 font-normal">Visible in leaderboards</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={40}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                <Edit3 className="w-4 h-4 text-slate-500 absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Tab Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Choose Avatar Source
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'presets'
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Developer Personas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'url'
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Image URL</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Upload File */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-500/10 scale-[0.99]'
                      : 'border-slate-700 hover:border-cyan-400/80 bg-slate-950/60 hover:bg-slate-950'
                  } group`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xl shadow-cyan-500/15">
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>

                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold text-sm">
                        <FileImage className="w-4 h-4" />
                        <span className="truncate max-w-xs">{selectedFile.name}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to save
                      </p>
                      <p className="text-xs text-cyan-400 font-semibold hover:underline">
                        Click or drag another file to replace
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-base sm:text-lg font-bold text-white">
                        Drag and drop your image here, or{' '}
                        <span className="text-cyan-400 underline underline-offset-4">browse files</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Supported formats: PNG, JPG, WEBP, GIF, SVG (Max file size: 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: 8 Developer Presets */}
            {activeTab === 'presets' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Click any persona to select:</span>
                  <span className="text-cyan-400 font-bold">8 Handcrafted Avatars</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_AVATARS.map((preset) => {
                    const isSelected = previewUrl === preset.path;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePresetSelect(preset.path)}
                        className={`group relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 ring-2 ring-cyan-500/40 shadow-xl shadow-cyan-500/15 scale-[1.03]'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 hover:bg-slate-950'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-2xl p-1 bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preset.path}
                            alt={preset.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="space-y-0.5 w-full">
                          <div className="text-xs font-bold text-white truncate">
                            {preset.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {preset.role}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: Direct URL */}
            {activeTab === 'url' && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <label className="text-xs font-bold text-slate-300 block">
                  Public Direct Image URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://github.com/identicons/username.png"
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={handleUrlApply}
                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs sm:text-sm font-bold text-white border border-slate-700 transition-colors cursor-pointer shrink-0"
                  >
                    Preview URL
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  You can paste any direct web image link (GitHub avatar, Discord, Gravatar, Unsplash, etc.).
                </p>
              </div>
            )}

            {/* Feedback Notifications */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm font-medium animate-fade-in flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-sm font-semibold flex items-center gap-2.5 animate-fade-in">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Bottom Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-800">
              <Link
                href="/profile"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition-colors cursor-pointer"
              >
                Cancel
              </Link>

              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:from-cyan-300 hover:to-sky-300 transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <span>Save & Apply Avatar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
