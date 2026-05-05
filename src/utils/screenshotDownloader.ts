import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { ROLES } from '@/types/roles';

export interface ScreenshotData {
  moduleName: string;
  description: string;
  globalIndex: number;
  blob: Blob;
}

export async function captureScreenshot(_description: string = ''): Promise<Blob | null> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const canvas = await html2canvas(document.documentElement, {
      backgroundColor: '#f4f7fb',
      scale: 2,
      margin: 0,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob && blob.size > 0 ? blob : null), 'image/png', 0.95);
    });
  } catch (err) {
    return null;
  }
}

function findButtonByText(texts: string[]): HTMLElement | null {
  const allButtons = document.querySelectorAll('button');

  for (const button of allButtons) {
    const text = button.textContent || '';

    for (const searchText of texts) {
      if (text.includes(searchText)) {
        return button as HTMLElement;
      }
    }
  }

  return null;
}

export async function captureModuleScreenshots(moduleName: string, globalIndex: number): Promise<ScreenshotData[]> {
  const screenshots: ScreenshotData[] = [];
  let currentIndex = globalIndex;

  try {
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const blob1 = await captureScreenshot('Vista Inicial');

    if (blob1) {
      screenshots.push({
        moduleName,
        description: 'Vista_Inicial',
        globalIndex: currentIndex,
        blob: blob1,
      });
      currentIndex++;
    }
  } catch (err) {
    // Silencioso para no interrumpir el flujo
  }

  try {
    const buttonTexts = ['Nueva', 'Nuevo', 'Crear', 'Agregar', 'Nueva Unidad', 'Editar'];
    const button = findButtonByText(buttonTexts);

    if (button) {
      button.click();
      await new Promise((resolve) => setTimeout(resolve, 1300));

      const blob2 = await captureScreenshot('Panel Opciones');

      if (blob2) {
        screenshots.push({
          moduleName,
          description: 'Opciones_o_Modal',
          globalIndex: currentIndex,
          blob: blob2,
        });
        currentIndex++;
      }

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27 });
      document.dispatchEvent(escapeEvent);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const closeBtn = document.querySelector('[class*="close"], button:has(> svg[class*="X"]), [aria-label*="Cerrar"]');
      if (closeBtn instanceof HTMLElement) {
        closeBtn.click();
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  } catch (err) {
    // Silencioso para no interrumpir el flujo
  }

  try {
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const viewportHeight = window.innerHeight;
    window.scrollTo(0, viewportHeight * 0.5);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const blob3 = await captureScreenshot('Funciones Items');

    if (blob3) {
      screenshots.push({
        moduleName,
        description: 'Funciones_e_Items',
        globalIndex: currentIndex,
        blob: blob3,
      });
      currentIndex++;
    }
  } catch (err) {
    // Silencioso para no interrumpir el flujo
  }

  try {
    const totalHeight = document.documentElement.scrollHeight;
    window.scrollTo(0, totalHeight);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const blob4 = await captureScreenshot('Final Modulo');

    if (blob4) {
      screenshots.push({
        moduleName,
        description: 'Final_Modulo',
        globalIndex: currentIndex,
        blob: blob4,
      });
      currentIndex++;
    }
  } catch (err) {
    // Silencioso para no interrumpir el flujo
  }

  window.scrollTo(0, 0);
  await new Promise((resolve) => setTimeout(resolve, 500));

  return screenshots;
}

export async function downloadScreenshotsAsZip(
  allScreenshotsByProfile: Record<string, ScreenshotData[]>,
  profileIds: string[],
): Promise<void> {
  const zip = new JSZip();
  const mainFolder = zip.folder('Capturas_UI_UX_Diseno');

  if (!mainFolder) return;

  let globalIndex = 1;
  let profileIndex = 1;
  let totalAddedFiles = 0;

  for (const profileId of profileIds) {
    const profileName = ROLES[profileId as keyof typeof ROLES]?.label.replace(/\s+/g, '_') || profileId;
    const screenshots = allScreenshotsByProfile[profileId] || [];

    if (screenshots.length === 0) continue;

    const profileFolder = mainFolder.folder(`${String(profileIndex).padStart(2, '0')}_${profileName}`);
    profileIndex++;

    if (!profileFolder) continue;

    for (const screenshot of screenshots) {
      try {
        const paddedIndex = String(globalIndex).padStart(2, '0');
        const fileName = `${paddedIndex}_${screenshot.moduleName}_${screenshot.description}.png`;

        if (!screenshot.blob || screenshot.blob.size === 0) continue;

        profileFolder.file(fileName, screenshot.blob);
        globalIndex++;
        totalAddedFiles++;
      } catch (err) {
        // Silencioso para no interrumpir el flujo
      }
    }
  }

  if (totalAddedFiles === 0) return;

  try {
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    if (!zipBlob || zipBlob.size === 0) return;

    const blobUrl = URL.createObjectURL(zipBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = 'Capturas_UI_UX_Diseno.zip';
    downloadLink.type = 'application/zip';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    document.body.removeChild(downloadLink);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 2000);
  } catch (err) {
    // Silencioso para no interrumpir el flujo
  }
}
