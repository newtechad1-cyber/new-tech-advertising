import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  const newOverlay = () => ({
    id: Date.now(),
    text: 'Your Text Here',
    x: 100, y: 100,
    fontSize: 36,
    color: '#ffffff',
    font: 'Impact',
    align: 'center',
    bold: false,
    shadow: true,
  });

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const maxW = 800;
      const scale = Math.min(1, maxW / image.width);
      setCanvasSize({ w: image.width * scale, h: image.height * scale });
      setImg(image);
    };
    image.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);
    ctx.drawImage(img, 0, 0, canvasSize.w, canvasSize.h);

    overlays.forEach(o => {
      ctx.font = `${o.bold ? 'bold ' : ''}${o.fontSize}px ${o.font}`;
      ctx.textAlign = o.align;
      ctx.fillStyle = o.color;
      if (o.shadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
      const lines = o.text.split('\n');
      lines.forEach((line, i) => ctx.fillText(line, o.x, o.y + i * (o.fontSize + 4)));

      if (selected === o.id) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        const lineH = o.fontSize + 4;
        const h = lines.length * lineH;
        const w = Math.max(...lines.map(l => ctx.measureText(l).width));
        const ox = o.align === 'center' ? o.x - w / 2 : o.align === 'right' ? o.x - w : o.x;
        ctx.strokeRect(ox - 4, o.y - o.fontSize - 4, w + 8, h + 8);
        ctx.setLineDash([]);
      }
    });
  }, [img, overlays, selected, canvasSize]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hit = [...overlays].reverse().find(o => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.font = `${o.bold ? 'bold ' : ''}${o.fontSize}px ${o.font}`;
      const lines = o.text.split('\n');
      const w = Math.max(...lines.map(l => ctx.measureText(l).width));
      const h = lines.length * (o.fontSize + 4);
      const ox = o.align === 'center' ? o.x - w / 2 : o.align === 'right' ? o.x - w : o.x;
      return mx >= ox - 4 && mx <= ox + w + 4 && my >= o.y - o.fontSize - 4 && my <= o.y + h + 4;
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
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setOverlays(prev => prev.map(o => o.id === dragging.id ? { ...o, x: mx - dragging.startX, y: my - dragging.startY } : o));
  };

  const handleMouseUp = () => setDragging(null);

  const updateSelected = (key, val) => setOverlays(prev => prev.map(o => o.id === selected ? { ...o, [key]: val } : o));

  const selectedOverlay = overlays.find(o => o.id === selected);

  const handleSave = () => {
    canvasRef.current.toBlob(blob => onSave(blob), 'image/png');
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
          <Button size="sm" variant="outline" onClick={handleDownload} className="border-slate-600 text-slate-300"><Download className="w-4 h-4 mr-1" />Download</Button>
          <Button size="sm" onClick={handleSave} className="bg-pink-600 hover:bg-pink-700"><Save className="w-4 h-4 mr-1" />Save to Library</Button>
          <Button size="icon" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
          <canvas
            ref={canvasRef}
            width={canvasSize.w}
            height={canvasSize.h}
            className="border border-slate-700 cursor-crosshair max-w-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        {/* Sidebar */}
        <div className="w-72 bg-slate-900 border-l border-slate-700 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-700">
            <Button onClick={() => { const o = newOverlay(); setOverlays(p => [...p, o]); setSelected(o.id); }} className="w-full bg-pink-600 hover:bg-pink-700">
              <Plus className="w-4 h-4 mr-2" />Add Text
            </Button>
          </div>

          {/* Layer list */}
          <div className="p-4 border-b border-slate-700 space-y-2">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Text Layers</p>
            {overlays.length === 0 && <p className="text-slate-500 text-sm">No text added yet</p>}
            {overlays.map(o => (
              <div key={o.id} onClick={() => setSelected(o.id)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm ${selected === o.id ? 'bg-pink-900/50 border border-pink-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
                <span className="text-white truncate flex-1">{o.text.split('\n')[0]}</span>
                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 shrink-0"
                  onClick={e => { e.stopPropagation(); setOverlays(p => p.filter(x => x.id !== o.id)); setSelected(null); }}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Edit selected */}
          {selectedOverlay && (
            <div className="p-4 space-y-4">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Edit Text</p>
              <textarea
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg p-2 text-sm resize-none h-20"
                value={selectedOverlay.text}
                onChange={e => updateSelected('text', e.target.value)}
              />
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Font Size</label>
                <input type="range" min="12" max="120" value={selectedOverlay.fontSize}
                  onChange={e => updateSelected('fontSize', +e.target.value)}
                  className="w-full accent-pink-500" />
                <span className="text-slate-300 text-xs">{selectedOverlay.fontSize}px</span>
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