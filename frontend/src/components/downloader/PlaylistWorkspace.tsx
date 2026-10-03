'use client';

import React, { useState, useRef, useMemo } from 'react';
import { ResolveResponse, PlaylistItem } from '@/types/api';
import { resolveMedia, getProxyStreamUrl } from '@/lib/api-client';
import {
  ListVideo,
  Download,
  Music,
  Video,
  Clock,
  CheckSquare,
  Square,
  Search,
  Loader2,
  AlertCircle,
  Play,
  Pause,
  StopCircle,
  CheckCircle2,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { AffiliateBanner } from '../monetization/AffiliateBanner';

interface PlaylistWorkspaceProps {
  data: ResolveResponse;
}

export function PlaylistWorkspace({ data }: PlaylistWorkspaceProps) {
  const items = useMemo(() => data.playlist_items || [], [data.playlist_items]);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(items.map((i) => i.id)));
  const [searchQuery, setSearchQuery] = useState('');
  const [targetQuality, setTargetQuality] = useState<'video' | 'audio'>('video');

  // Batch download state
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeItemTitle, setActiveItemTitle] = useState('');
  const [batchStatusMessage, setBatchStatusMessage] = useState('');
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  // Single item resolving loading map
  const [resolvingItemId, setResolvingItemId] = useState<string | null>(null);

  const abortRef = useRef(false);
  const pausedRef = useRef(false);

  // Filtered items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) => item.title.toLowerCase().includes(q) || (item.channel && item.channel.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

  // Duration formatter
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toggle single item selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select / Deselect All
  const handleToggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Trigger individual video download directly
  const handleSingleDownload = async (item: PlaylistItem, type: 'video' | 'audio') => {
    setResolvingItemId(item.id);
    try {
      const resolved = await resolveMedia(item.url);
      let targetFmt = null;
      if (type === 'audio') {
        targetFmt = resolved.formats.find((f) => f.is_audio_only || f.ext === 'mp3');
      } else {
        targetFmt = resolved.formats.find((f) => !f.is_audio_only && f.ext === 'mp4');
      }
      if (!targetFmt && resolved.formats.length > 0) {
        targetFmt = resolved.formats[0];
      }

      if (targetFmt) {
        const streamUrl = getProxyStreamUrl(
          targetFmt.direct_url,
          `${item.title.replace(/[/\\?%*:|"<>]/g, '_')}.${targetFmt.ext}`,
          targetFmt.audio_url
        );
        const link = document.createElement('a');
        link.href = streamUrl;
        link.download = `${item.title}.${targetFmt.ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Failed to resolve item:', err);
      alert(`Could not resolve stream for "${item.title}".`);
    } finally {
      setResolvingItemId(null);
    }
  };

  // Sequential Batch Download Runner
  const startBatchDownload = async () => {
    const queue = items.filter((item) => selectedIds.has(item.id));
    if (queue.length === 0) {
      alert('Please select at least one video to download.');
      return;
    }

    setIsBatchRunning(true);
    setIsPaused(false);
    abortRef.current = false;
    pausedRef.current = false;
    setCompletedIds(new Set());
    setFailedIds(new Set());

    for (let i = 0; i < queue.length; i++) {
      if (abortRef.current) break;

      while (pausedRef.current) {
        await new Promise((r) => setTimeout(r, 500));
        if (abortRef.current) break;
      }
      if (abortRef.current) break;

      const currentItem = queue[i];
      setCurrentIndex(i + 1);
      setActiveItemTitle(currentItem.title);
      setBatchStatusMessage(`Resolving formats for "${currentItem.title}"...`);

      try {
        const resolved = await resolveMedia(currentItem.url);

        let chosenFmt = null;
        if (targetQuality === 'audio') {
          chosenFmt = resolved.formats.find((f) => f.is_audio_only || f.ext === 'mp3');
        } else {
          chosenFmt = resolved.formats.find((f) => !f.is_audio_only && f.ext === 'mp4');
        }
        if (!chosenFmt && resolved.formats.length > 0) {
          chosenFmt = resolved.formats[0];
        }

        if (chosenFmt) {
          setBatchStatusMessage(`Starting stream download: ${chosenFmt.quality_label}...`);
          const streamUrl = getProxyStreamUrl(
            chosenFmt.direct_url,
            `${currentItem.title.replace(/[/\\?%*:|"<>]/g, '_')}.${chosenFmt.ext}`,
            chosenFmt.audio_url
          );

          // Trigger download in browser
          const link = document.createElement('a');
          link.href = streamUrl;
          link.download = `${currentItem.title}.${chosenFmt.ext}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setCompletedIds((prev) => new Set(prev).add(currentItem.id));
        } else {
          setFailedIds((prev) => new Set(prev).add(currentItem.id));
        }
      } catch (err) {
        console.error('Batch item resolution failed:', err);
        setFailedIds((prev) => new Set(prev).add(currentItem.id));
      }

      // Safe pause between sequential downloads to prevent browser popup block
      setBatchStatusMessage('Throttling 1.5s to maintain CDN reliability...');
      await new Promise((r) => setTimeout(r, 1500));
    }

    setIsBatchRunning(false);
    setActiveItemTitle('');
    setBatchStatusMessage('Batch download sequence completed!');
  };

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setIsPaused(pausedRef.current);
  };

  const stopBatch = () => {
    abortRef.current = true;
    pausedRef.current = false;
    setIsBatchRunning(false);
    setIsPaused(false);
    setBatchStatusMessage('Batch download cancelled.');
  };

  const selectedCount = selectedIds.size;
  const progressPercent =
    selectedCount > 0 ? Math.round((currentIndex / selectedCount) * 100) : 0;

  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      {/* Playlist Master Header */}
      <div className="tool-panel p-5 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-5 items-start">
          {/* Playlist Thumbnail Poster */}
          <div className="relative w-full md:w-64 h-48 md:h-40 tool-control overflow-hidden bg-zinc-100 dark:bg-zinc-950 flex-shrink-0 border border-zinc-200 dark:border-zinc-800 group">
            {data.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.thumbnail}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-xs font-mono-data">
                No Preview
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2.5">
              <span className="px-2 py-0.5 tool-control bg-black/85 border border-zinc-700 text-[10px] font-mono-data text-white flex items-center gap-1.5">
                <ListVideo className="w-3 h-3 text-zinc-300" />
                Playlist Catalog
              </span>
            </div>
          </div>

          {/* Playlist Metadata & Summary */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] uppercase font-mono-data px-2 py-0.5 tool-control bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                YouTube Playlist
              </span>
              <span className="text-[10px] font-mono-data px-2 py-0.5 tool-control bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                {items.length} Entries
              </span>
              <span className="text-[10px] font-mono-data px-2 py-0.5 tool-control bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                Direct Stream Pipe
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug mb-2 line-clamp-2">
              {data.title}
            </h2>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
              Batch-download selected items sequentially with zero server disk buffering. High-speed direct stream caching.
            </p>

            <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap font-mono-data">
              <a
                href={data.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1 transition"
              >
                <span>Upstream Playlist</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={handleShare}
                className="hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1 transition"
              >
                <Share2 className="w-3 h-3" />
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Control Console */}
      <div className="tool-panel p-4 md:p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Format Selector & Select All */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleToggleSelectAll}
              className="flex items-center gap-1.5 px-3 py-1.5 tool-control bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 transition"
            >
              {selectedCount === items.length ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Select All ({items.length})</span>
                </>
              )}
            </button>

            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 tool-control border border-zinc-200 dark:border-zinc-800 text-xs">
              <button
                onClick={() => setTargetQuality('video')}
                className={`flex items-center gap-1.5 px-3 py-1 tool-control font-medium transition text-xs ${
                  targetQuality === 'video'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>MP4 Video (HD)</span>
              </button>
              <button
                onClick={() => setTargetQuality('audio')}
                className={`flex items-center gap-1.5 px-3 py-1 tool-control font-medium transition text-xs ${
                  targetQuality === 'audio'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>MP3 Audio</span>
              </button>
            </div>

            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono-data">
              Selected: <strong className="text-zinc-900 dark:text-zinc-100">{selectedCount}</strong> / {items.length}
            </span>
          </div>

          {/* Primary Batch Download Button */}
          <div className="flex items-center gap-2">
            {!isBatchRunning ? (
              <button
                onClick={startBatchDownload}
                disabled={selectedCount === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 btn-primary-action shadow-sm font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Start Batch Download ({selectedCount})</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={togglePause}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium tool-control transition shadow-sm"
                >
                  {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                <button
                  onClick={stopBatch}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 text-xs font-medium tool-control transition shadow-sm"
                >
                  <StopCircle className="w-3 h-3" />
                  <span>Stop</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Real-Time Batch Monitor Console */}
        {isBatchRunning && (
          <div className="mt-4 p-3.5 tool-panel bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2 font-mono-data">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 animate-spin" />
                <span>
                  Processing item {currentIndex} of {selectedCount}
                </span>
              </div>
              <span className="text-zinc-900 dark:text-zinc-100 font-mono-data">{progressPercent}%</span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mb-2.5">
              <div
                className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-1 font-mono-data text-[11px]">
              <span className="truncate font-medium text-zinc-900 dark:text-zinc-200 max-w-md">
                Active: {activeItemTitle || 'Initializing queue...'}
              </span>
              <span className="text-zinc-500">{batchStatusMessage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between mb-3 gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter videos in this playlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 tool-control text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition"
          />
        </div>

        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono-data">
          Showing {filteredItems.length} of {items.length} items
        </span>
      </div>

      {/* Playlist Items Grid / List */}
      <div className="space-y-2">
        {filteredItems.map((item, idx) => {
          const isSelected = selectedIds.has(item.id);
          const isCompleted = completedIds.has(item.id);
          const isFailed = failedIds.has(item.id);
          const isResolving = resolvingItemId === item.id;

          return (
            <div
              key={item.id}
              className={`tool-panel p-2.5 md:p-3 transition duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isSelected
                  ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/90'
                  : 'border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/60 opacity-80'
              }`}
            >
              {/* Checkbox + Index + Thumbnail + Title */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  onClick={() => toggleSelect(item.id)}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition flex-shrink-0"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                  )}
                </button>

                <span className="text-xs font-mono-data text-zinc-400 dark:text-zinc-500 w-5 flex-shrink-0 text-right">
                  #{idx + 1}
                </span>

                {/* Video Thumbnail */}
                <div className="relative w-20 h-12 tool-control overflow-hidden bg-zinc-100 dark:bg-zinc-950 flex-shrink-0 border border-zinc-200 dark:border-zinc-800">
                  {item.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400 dark:text-zinc-600 font-mono-data">
                      Thumb
                    </div>
                  )}
                  {item.duration_seconds && (
                    <div className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/90 rounded text-[9px] font-mono-data text-white flex items-center gap-0.5">
                      <Clock className="w-2 h-2 text-zinc-300" />
                      {formatDuration(item.duration_seconds)}
                    </div>
                  )}
                </div>

                {/* Video Title & Channel */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs md:text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5 font-mono-data">
                    {item.channel || 'YouTube Video'}
                  </p>
                </div>
              </div>

              {/* Status Badge & Single Download Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                {isCompleted && (
                  <span className="flex items-center gap-1 text-[11px] font-mono-data text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 tool-control">
                    <CheckCircle2 className="w-3 h-3" />
                    Saved
                  </span>
                )}
                {isFailed && (
                  <span className="flex items-center gap-1 text-[11px] font-mono-data text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 px-2 py-0.5 tool-control">
                    <AlertCircle className="w-3 h-3" />
                    Failed
                  </span>
                )}

                <button
                  onClick={() => handleSingleDownload(item, 'video')}
                  disabled={isResolving}
                  className="flex items-center gap-1.5 px-2.5 py-1 tool-control bg-zinc-100 hover:bg-zinc-900 hover:text-white dark:bg-zinc-800 dark:hover:bg-zinc-100 dark:hover:text-zinc-950 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200 dark:border-zinc-700 transition disabled:opacity-50 font-mono-data"
                  title="Download MP4 Video"
                >
                  {isResolving ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Video className="w-3 h-3" />
                  )}
                  <span>MP4</span>
                </button>

                <button
                  onClick={() => handleSingleDownload(item, 'audio')}
                  disabled={isResolving}
                  className="flex items-center gap-1.5 px-2.5 py-1 tool-control bg-zinc-100 hover:bg-zinc-900 hover:text-white dark:bg-zinc-800 dark:hover:bg-zinc-100 dark:hover:text-zinc-950 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200 dark:border-zinc-700 transition disabled:opacity-50 font-mono-data"
                  title="Download MP3 Audio"
                >
                  {isResolving ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Music className="w-3 h-3" />
                  )}
                  <span>MP3</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monetization Footer */}
      <div className="mt-8">
        <AffiliateBanner />
      </div>
    </div>
  );
}
