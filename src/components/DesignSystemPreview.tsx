/**
 * Design System Preview v1.0 - Live Theme Customizer
 * SuperAdmin Design Hub Component
 */

import React, { useEffect, useState } from 'react';
import { Palette, Type, Shapes, Shadow, Settings, Save, Reset, Eye, CheckCircle2, HardDrive, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DEFAULT_THEME, 
  THEME_PRESETS, 
  useThemeStore, 
  applyTheme, 
  hexToHsl, 
  isValidHsl 
} from '@/constants/themeConfig';
import { getCssVar } from '@/constants/designTokens';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const DesignSystemPreview: React.FC = () => {
  const [localTheme, setLocalTheme] = useState(DEFAULT_THEME);
  const { theme: storeTheme, setPrimaryColor, setSecondaryColor, resetToDefault, savePreset } = useThemeStore();

  // Sync store → local
  useEffect(() => {
    setLocalTheme(storeTheme);
  }, [storeTheme]);

  // Apply theme live
  useEffect(() => {
    applyTheme(localTheme);
  }, [localTheme]);

  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hsl = hexToHsl(e.target.value);
    setLocalTheme({ ...localTheme, primaryColor: hsl });
    setPrimaryColor(hsl);
  };

  const handleSecondaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hsl = hexToHsl(e.target.value);
    setLocalTheme({ ...localTheme, secondaryColor: hsl });
    setSecondaryColor(hsl);
  };

  const handleSavePreset = () => {
    const name = `Preset ${localTheme.savedPresets.length + 1}`;
    savePreset(name);
    toast({ title: 'Preset guardado', description: name });
  };

  const loadPreset = (preset: typeof THEME_PRESETS[0]) => {
    const newTheme = {
      ...localTheme,
      primaryColor: `hsl(${preset.primary})`,
      secondaryColor: `hsl(${preset.secondary})`,
    };
    setLocalTheme(newTheme);
    applyTheme(newTheme);
    toast({ title: 'Preset cargado', description: preset.name });
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-custom)] to-[var(--secondary-custom)] flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-h1 text-[var(--primary-custom)]">Design System</h1>
            <p className="text-muted-foreground">Customiza el tema de BUNTY en vivo</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefault} size="sm">
            <Reset className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button onClick={handleSavePreset} size="sm">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <Card className="bg-white rounded-xl border border-black/8 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Colors */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Primary Color
              </label>
              <div className="flex gap-3 items-center">
                <Input
                  type="color" 
                  value={localTheme.primaryColor}
                  onChange={handlePrimaryChange}
                  className="w-12 h-12 rounded-lg border border-muted"
                />
                <Input
                  type="text"
                  value={localTheme.primaryColor}
                  onChange={(e) => {
                    if (isValidHsl(e.target.value)) {
                      setLocalTheme({ ...localTheme, primaryColor: e.target.value });
                    }
                  }}
                  className="flex-1"
                  placeholder="hsl(217 54% 20%)"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Secondary Color
              </label>
              <div className="flex gap-3 items-center">
                <Input
                  type="color" 
                  value={localTheme.secondaryColor}
                  onChange={handleSecondaryChange}
                  className="w-12 h-12 rounded-lg border border-muted"
                />
                <Input
                  type="text"
                  value={localTheme.secondaryColor}
                  onChange={(e) => {
                    if (isValidHsl(e.target.value)) {
                      setLocalTheme({ ...localTheme, secondaryColor: e.target.value });
                    }
                  }}
                  className="flex-1"
                  placeholder="hsl(169 98% 36%)"
                />
              </div>
            </div>

            {/* Presets */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {THEME_PRESETS.map((preset, i) => (
                  <Badge 
                    key={i}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent/20"
                    onClick={() => loadPreset(preset)}
                  >
                    {preset.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick toggles */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t">
              <Button variant="ghost" size="sm" className="justify-start h-10">
                <Type className="w-4 h-4 mr-2" />
                Font Scale: {localTheme.fontScale}x
              </Button>
              <Button variant="ghost" size="sm" className="justify-start h-10">
                <Shadow className="w-4 h-4 mr-2" />
                Shadows: {localTheme.customShadows ? 'On' : 'Off'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Live Preview */}
        <div className="space-y-4">
          <Card className="bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview en Vivo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="font-h1 text-[var(--primary-custom)] mb-2">
                Heading H1 - {localTheme.primaryColor}
              </div>
              <div className="font-h2 text-[var(--secondary-custom)] mb-4">
                Heading H2 - {localTheme.secondaryColor}
              </div>
              <div className="text-body text-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                <span className="text-muted-foreground">Texto secundario con sombras custom.</span>
              </div>
              <Button className={getButtonClasses('primary', 'lg')} className="w-full shadow-custom-lg">
                Button Premium Live
              </Button>
              <div className="grid grid-cols-3 gap-2 pt-4">
                <div className="h-12 bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md shadow-custom-sm"></div>
                <div className="h-12 bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md shadow-custom-md"></div>
                <div className="h-12 bg-white rounded-xl border border-black/8 shadow-sm hover:shadow-md shadow-elevation"></div>
              </div>
            </CardContent>
          </Card>

          {/* Tokens Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>Tokens Activos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><strong>Primary:</strong> hsl(var(--primary-custom))</div>
              <div><strong>Secondary:</strong> hsl(var(--secondary-custom))</div>
              <div><strong>Radius:</strong> var(--radius-custom)</div>
              <div><strong>Shadows:</strong> {localTheme.customShadows ? 'Active' : 'Disabled'}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Stats */}
      <Card className="bg-white rounded-xl border border-black/8 shadow-sm">
        <CardContent className="p-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Tema aplicado globalmente
            </span>
            <span className="inline-flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-blue-500" />
              Persistente en `useAppStore`
            </span>
            <span className="inline-flex items-center gap-2">
              <Paintbrush className="h-4 w-4 text-violet-500" />
              Live preview funcionando
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignSystemPreview;
