import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, Trash2, Download, Save } from 'lucide-react';

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

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const maxW = 800;
      const scale = Math.min(1, maxW / image.width);
      const w = Math.round(image.width * scale);
      const h = Math.round(image.height * scale);
      setCanvasSize({ w, h });
      setImg(image);
    };
    image.onerror = () => {
      // If crossOrigin fails, try without it
      const image2 = new Image();
      image2.onload = () => {
        const maxW = 800;
        const scale = Math.min(1, maxW / image2.width);
        const w = Math.round(image2.width * scale);
        const h = Math.round(image2.height * scale);
        setCanvasSize({ w, h });
        setImg(image2);
      };
      image2.src = imageUrl;
    };
    image.src = imageUrl;
  }, [imageUrl]);

  const newOverlay = (w, h) => ({
    id: Date.now(),
    text: 'Your Text Here',
    x: Math.round(w / 2),
    y: Math.round(h / 2),
    fontSize: 36,
    color: '#ffffff',
    font: 'Impact',
    align: 'center',
    bold: false,
    shadow: true,
  });

  // Redraw canvas whenever img, overlays, selected, or canvasSize changes
  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);
    ctx.drawImage(img, 0, 0, canvasSize.w, canvasSize.h);

    overlays.forEach(o => {
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
      const lines = o.text.split('\n');
      lines.forEach((line, i) => {
        ctx.fillText(line, o.x, o.y + i * (o.fontSize + 4));
      });
      ctx.restore();

      // Draw selection box
      if (selected === o.id) {
        ctx.save();
        ctx.font = `${o.bold ? 'bold ' : ''}${o.fontSize}px ${o.font}`;
        ctx.textAlign = o.align;
        const lines2 = o.text.split('\n');
        const lineH = o.fontSize + 4;
        const h = lines2.length * lineH;
        const w = Math.max(...lines2.map(l => ctx.measureText(l).width));
        const ox = o.align === 'center' ? o.x - w / 2 : o.align === 'right' ? o.x - w : o.x;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(ox - 4, o.y - o.fontSize - 4, w + 8, h + 8);
        ctx.restore();
      }
    });
  }, [img, overlays, selected, canvasSize]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasSize.w / rect.width;
    const scaleY = canvasSize.h / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const ctx = canvasRef.current.getContext('2d');
    const hit = [...overlays].reverse().find(o => {
      ctx.font = `${o.bold ? 'bold ' : ''}${o.fontSize}px ${o.font}`;
      const lines = o.text.split('\n');
      const w = Math.max(...lines.map(l => ctx.measureText(l).width));
      const h = lines.length * (o.fontSize + 4);
      const ox = o.align === 'center' ? o.x - w / 2 : o.align === 'right' ? o.x - w : o.x;
      return mx >= ox - 8 && mx <= ox + w + 8 && my >= o.y - o.fontSize - 8 && my <= o.y + h + 8;
    });

    if (hit) {
      setSelected(hit.id);
      setDragging({ id: hit.id, startX: mx - hit.x, startY: my - hit.y });
    } else {
      setSelected(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasSize.w / rect.width;
    const scaleY = canvasSize.h / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    setOverlays(prev => prev.map(o =>
      o.id === dragging.id ? { ...o, x: Math.round(mx - dragging.startX), y: Math.round(my - dragging.startY) } : o
    ));
  };

  const handleMouseUp = () => setDragging(null);

  const updateSelected = (key, val) =>
    setOverlays(prev => prev.map(o => o.id === selected ? { ...o, [key]: val } : o));

  const selectedOverlay = overlays.find(o => o.id === selected);

  const handleSave = async () => {
    if (!canvasRef.current) return;
    setSaving(true);
    // Redraw without selection boxes before saving
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);
    ctx.drawImage(img, 0, 0, canvasSize.w, canvasSize.h);
    overlays.forEach(o => {
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
    });

    canvas.toBlob(blob => {
      if (blob) {
        onSave(blob);
      }
      setSaving(false);
    }, 'image/png');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700 bg-slate-900">
        <h3 className="text-white font-semibold">Image Editor</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleDownload} className="border-slate-600 text-slate-300">
            <Download className="w-4 h-4 mr-1" />Download
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="bg-pink-600 hover:bg-pink-700">
            <Save className="w-4 h-4 mr-1" />{saving ? 'Saving...' : 'Save to Library'}
          </Button>
          <Button size="icon" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto bg-slate-950">
          {!img && (
            <p className="text-slate-400">Loading image...</p>
          )}
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
            <Button
              onClick={() => {
                const o = newOverlay(canvasSize.w, canvasSize.h);
                setOverlays(p => [...p, o]);
                setSelected(o.id);
              }}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              <Plus className="w-4 h-4 mr-2" />Add Text
            </Button>
          </div>

          {/* Layer list */}
          <div className="p-4 border-b border-slate-700 space-y-2">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Text Layers</p>
            {overlays.length === 0 && <p className="text-slate-500 text-sm">No text added yet. Click "Add Text" to start.</p>}
            {overlays.map(o => (
              <div
                key={o.id}
                onClick={() => setSelected(o.id)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm ${selected === o.id ? 'bg-pink-900/50 border border-pink-600' : 'bg-slate-800 hover:bg-slate-700'}`}
              >
                <span className="text-white truncate flex-1">{o.text.split('\n')[0]}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-red-400 shrink-0"
                  onClick={e => {
                    e.stopPropagation();
                    setOverlays(p => p.filter(x => x.id !== o.id));
                    setSelected(null);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Edit selected overlay */}
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
                <input
                  type="range" min="12" max="120"
                  value={selectedOverlay.fontSize}
                  onChange={e => updateSelected('fontSize', +e.target.value)}
                  className="w-full accent-pink-500"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Color</label>
                <input
                  type="color"
                  value={selectedOverlay.color}
                  onChange={e => updateSelected('color', e.target.value)}
                  className="w-full h-9 rounded cursor-pointer bg-slate-800 border border-slate-600"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Font</label>
                <select
                  value={selectedOverlay.font}
                  onChange={e => updateSelected('font', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg p-2 text-sm"
                >
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Alignment</label>
                <div className="flex gap-2">
                  {ALIGNS.map(a => (
                    <button
                      key={a}
                      onClick={() => updateSelected('align', a)}
                      className={`flex-1 py-1 rounded text-xs border transition-colors ${selectedOverlay.align === a ? 'bg-pink-600 border-pink-600 text-white' : 'border-slate-600 text-slate-400 hover:border-pink-500'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                  <input type="checkbox" checked={selectedOverlay.bold} onChange={e => updateSelected('bold', e.target.checked)} className="accent-pink-500" />
                  Bold
                </label>
                <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                  <input type="checkbox" checked={selectedOverlay.shadow} onChange={e => updateSelected('shadow', e.target.checked)} className="accent-pink-500" />
                  Shadow
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