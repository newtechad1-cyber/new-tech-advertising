import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, Trash2, Download, Save, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const FONTS = ['Arial', 'Georgia', 'Impact', 'Courier New', 'Verdana'];
const ALIGNS = ['left', 'center', 'right'];

export default function ImageEditor({ imageUrl, onSave, onClose }) {
  const canvasRef = useRef(null);
  const [overlays, setOverlays] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [img, setImg] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setImg(null);
    setOverlays([]);
    setSelected(null);
    setLoadError(false);
    loadImage(imageUrl);
  }, [imageUrl]);

  const loadImage = async (url) => {
    const loadFromSrc = (src) => new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });

    const setImageFromElement = (image) => {
      const maxW = 800;
      const scale = Math.min(1, maxW / image.width);
      setCanvasSize({ w: Math.round(image.width * scale), h: Math.round(image.height * scale) });
      setImg(image);
    };

    try {
      // Use the SDK proxy to fetch image bytes — avoids CORS canvas taint
      const res = await base44.functions.invoke('proxyImage', { url });
      // res.data may be arraybuffer or string depending on axios responseType
      let blobData = res.data;
      if (typeof blobData === 'string') {
        // Convert base64 or raw string to blob via fetch
        const dataRes = await fetch(`data:image/png;base64,${btoa(blobData)}`).catch(() => null);
        blobData = dataRes ? await dataRes.blob() : null;
      } else if (blobData instanceof ArrayBuffer || ArrayBuffer.isView(blobData)) {
        blobData = new Blob([blobData], { type: 'image/png' });
      }

      if (blobData) {
        const objectUrl = URL.createObjectURL(blobData instanceof Blob ? blobData : new Blob([blobData]));
        const image = await loadFromSrc(objectUrl).catch(() => null);
        if (image) return setImageFromElement(image);
      }
    } catch (e) {
      // proxy failed, fall through
    }

    // Fallback: direct load with crossOrigin
    const image = await loadFromSrc(url).catch(() => null);
    if (image) {
      setImageFromElement(image);
    } else {
      setLoadError(true);
    }
  };

  const drawCanvas = (ctx, w, h, currentImg, currentOverlays, includeSelection = true) => {
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(currentImg, 0, 0, w, h);

    currentOverlays.forEach(o => {
      ctx.save();
      ctx.font = `${o.bold ? 'bold ' : ''}${o.fontSize}px ${o.font}`;
      ctx.textAlign = o.align;
      ctx.fillStyle = o.color;
      if (o.shadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }
      o.text.split('\n').forEach((line, i) => {
        ctx.fillText(line, o.x, o.y + i * (o.fontSize + 4));
      });
      ctx.restore();

      if (includeSelection && selected === o.id) {
        ctx.save();
        ctx.font = `${o.bold ? 'bold ' : ''}${o.fontSize}px ${o.font}`;
        const lines = o.text.split('\n');
        const lineH = o.fontSize + 4;
        const totalH = lines.length * lineH;
        const textW = Math.max(...lines.map(l => ctx.measureText(l).width));
        const ox = o.align === 'center' ? o.x - textW / 2 : o.align === 'right' ? o.x - textW : o.x;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(ox - 4, o.y - o.fontSize - 4, textW + 8, totalH + 8);
        ctx.restore();
      }
    });
  };

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    drawCanvas(ctx, canvasSize.w, canvasSize.h, img, overlays, true);
  }, [img, overlays, selected, canvasSize]);

  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasSize.w / rect.width;
    const scaleY = canvasSize.h / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    const ctx = canvasRef.current.getContext('2d');

    const hit = [...overlays].reverse().find(o => {
      ctx.font = `${o.bold ? 'bold ' : ''}${o.fontSize}px ${o.font}`;
      const lines = o.text.split('\n');
      const textW = Math.max(...lines.map(l => ctx.measureText(l).width));
      const textH = lines.length * (o.fontSize + 4);
      const ox = o.align === 'center' ? o.x - textW / 2 : o.align === 'right' ? o.x - textW : o.x;
      return mx >= ox - 8 && mx <= ox + textW + 8 && my >= o.y - o.fontSize - 8 && my <= o.y + textH + 8;
    });

    if (hit) {
      setSelected(hit.id);
      setDragging({ id: hit.id, startX: mx - hit.x, startY: my - hit.y });
    } else {
      setSelected(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvasSize.w / rect.width);
    const my = (e.clientY - rect.top) * (canvasSize.h / rect.height);
    setOverlays(prev => prev.map(o =>
      o.id === dragging.id ? { ...o, x: Math.round(mx - dragging.startX), y: Math.round(my - dragging.startY) } : o
    ));
  };

  const handleMouseUp = () => setDragging(null);

  const updateSelected = (key, val) =>
    setOverlays(prev => prev.map(o => o.id === selected ? { ...o, [key]: val } : o));

  const selectedOverlay = overlays.find(o => o.id === selected);

  const handleSave = () => {
    if (!canvasRef.current || !img || saving) return;
    setSaving(true);

    // Create a fresh offscreen canvas to avoid taint issues from selection UI
    const offscreen = document.createElement('canvas');
    offscreen.width = canvasSize.w;
    offscreen.height = canvasSize.h;
    const ctx = offscreen.getContext('2d');
    drawCanvas(ctx, canvasSize.w, canvasSize.h, img, overlays, false);

    offscreen.toBlob(async blob => {
      if (blob) {
        try {
          await onSave(blob);
        } finally {
          setSaving(false);
        }
      } else {
        alert('Could not export image. The image may be CORS-restricted.');
        setSaving(false);
      }
    }, 'image/png');
  };

  const handleDownload = () => {
    if (!canvasRef.current || !img) return;
    const offscreen = document.createElement('canvas');
    offscreen.width = canvasSize.w;
    offscreen.height = canvasSize.h;
    const ctx = offscreen.getContext('2d');
    drawCanvas(ctx, canvasSize.w, canvasSize.h, img, overlays, false);
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = offscreen.toDataURL('image/png');
    link.click();
  };

  const addTextOverlay = () => {
    const o = {
      id: Date.now(),
      text: 'Your Text Here',
      x: Math.round(canvasSize.w / 2),
      y: Math.round(canvasSize.h / 2),
      fontSize: 36,
      color: '#ffffff',
      font: 'Impact',
      align: 'center',
      bold: false,
      shadow: true,
    };
    setOverlays(p => [...p, o]);
    setSelected(o.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700 bg-slate-900">
        <h3 className="text-white font-semibold">Image Editor</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleDownload} disabled={!img} className="border-slate-600 text-slate-300">
            <Download className="w-4 h-4 mr-1" />Download
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || !img} className="bg-pink-600 hover:bg-pink-700">
            {saving ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-1" />Save to Library</>}
          </Button>
          <Button size="icon" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas area */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto bg-slate-950">
          {!img && !loadError && (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p>Loading image...</p>
            </div>
          )}
          {loadError && <p className="text-red-400">Failed to load image. Please close and try again.</p>}
          <canvas
            ref={canvasRef}
            width={canvasSize.w}
            height={canvasSize.h}
            className="border border-slate-700 cursor-crosshair max-w-full"
            style={{ display: img ? 'block' : 'none' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        {/* Sidebar */}
        <div className="w-72 bg-slate-900 border-l border-slate-700 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-700">
            <Button onClick={addTextOverlay} disabled={!img} className="w-full bg-pink-600 hover:bg-pink-700">
              <Plus className="w-4 h-4 mr-2" />Add Text
            </Button>
          </div>

          <div className="p-4 border-b border-slate-700 space-y-2">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Text Layers</p>
            {overlays.length === 0 && <p className="text-slate-500 text-sm">No text added yet.</p>}
            {overlays.map(o => (
              <div
                key={o.id}
                onClick={() => setSelected(o.id)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm ${selected === o.id ? 'bg-pink-900/50 border border-pink-600' : 'bg-slate-800 hover:bg-slate-700'}`}
              >
                <span className="text-white truncate flex-1">{o.text.split('\n')[0]}</span>
                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 shrink-0"
                  onClick={e => { e.stopPropagation(); setOverlays(p => p.filter(x => x.id !== o.id)); setSelected(null); }}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          {selectedOverlay && (
            <div className="p-4 space-y-4">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Edit Text</p>
              <textarea
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg p-2 text-sm resize-none h-20"
                value={selectedOverlay.text}
                onChange={e => updateSelected('text', e.target.value)}
              />
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Font Size: {selectedOverlay.fontSize}px</label>
                <input type="range" min="12" max="120" value={selectedOverlay.fontSize}
                  onChange={e => updateSelected('fontSize', +e.target.value)} className="w-full accent-pink-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Color</label>
                <input type="color" value={selectedOverlay.color}
                  onChange={e => updateSelected('color', e.target.value)}
                  className="w-full h-9 rounded cursor-pointer bg-slate-800 border border-slate-600" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Font</label>
                <select value={selectedOverlay.font} onChange={e => updateSelected('font', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg p-2 text-sm">
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Alignment</label>
                <div className="flex gap-2">
                  {ALIGNS.map(a => (
                    <button key={a} onClick={() => updateSelected('align', a)}
                      className={`flex-1 py-1 rounded text-xs border transition-colors ${selectedOverlay.align === a ? 'bg-pink-600 border-pink-600 text-white' : 'border-slate-600 text-slate-400 hover:border-pink-500'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                  <input type="checkbox" checked={selectedOverlay.bold} onChange={e => updateSelected('bold', e.target.checked)} className="accent-pink-500" />Bold
                </label>
                <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                  <input type="checkbox" checked={selectedOverlay.shadow} onChange={e => updateSelected('shadow', e.target.checked)} className="accent-pink-500" />Shadow
                </label>
              </div>
              <p className="text-slate-500 text-xs">Drag text on the canvas to reposition</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}