import JSZip from 'jszip';

export interface ImageData {
  url: string;
  name: string;
  index: number;
}

export async function downloadImagesAsZip(
  images: ImageData[],
  profileName: string,
  sectionName: string
) {
  const zip = new JSZip();
  const folderName = `${profileName}_${sectionName}`;
  const folder = zip.folder(folderName);

  if (!folder) return;

  for (const image of images) {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const paddedIndex = String(image.index).padStart(2, '0');
      const fileName = `${paddedIndex}_${image.name}.jpg`;
      folder.file(fileName, blob);
    } catch (error) {
      console.error(`Error downloading image: ${image.name}`, error);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(zipBlob);
  link.href = url;
  link.download = `${folderName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function extractImageName(unit: string, type?: string): string {
  const cleanName = unit.replace(/[^a-zA-Z0-9]/g, '_');
  return type ? `${cleanName}_${type}` : cleanName;
}
