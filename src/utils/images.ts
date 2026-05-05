// Array of local unit images for fallback
export const UNIT_IMAGES = [
  '/unidades/comedor-comodo-estudio-o-habitacion-hotel_1262-12324.png',
  '/unidades/diferentes-tipos-departamentos-adquirir.png',
  '/unidades/disenos.departamentos.software.1.png',
  '/unidades/DSC_0453-Editar-Editar.png',
  '/unidades/estilo-minimalista-tendencias-decoracion-departamento.png',
  '/unidades/hermoso-apartamento-diseno-moderno-contemporaneo-luz-natural-frente-ventana-cortina-blanca_609648-70.png',
  '/unidades/OCLARO-6733-scaled.png',
  '/unidades/plantillas_blog_web1-5.png',
  '/unidades/principales-caracteristicas-departamentos-modernos.png',
  '/unidades/tipos-de-departamentos.png',
];

// Get a random image from local images
export const getRandomUnitImage = (seed?: string): string => {
  let index: number;
  if (seed) {
    // Use seed to get consistent image for same unit
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    index = Math.abs(hash) % UNIT_IMAGES.length;
  } else {
    index = Math.floor(Math.random() * UNIT_IMAGES.length);
  }
  return UNIT_IMAGES[index];
};

// Get image based on unit id for consistency
export const getUnitImage = (unitId: string): string => {
  return getRandomUnitImage(unitId);
};
