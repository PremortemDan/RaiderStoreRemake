<template>
  <section class="store-section">
    <div v-if="loading" class="loading">
      <div class="skeleton-grid" aria-hidden="true">
        <div v-for="n in 8" :key="n" class="skeleton-card">
          <div class="skeleton-art"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
      <p class="loading-text">{{ t('cargandoCosmeticos') }}</p>
    </div>

    <div v-else-if="error" class="state-box">
      <span class="state-emoji" aria-hidden="true">😵</span>
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <!-- Accesos rápidos a cada sección -->
      <nav v-if="sectionsList.length > 1" class="filter-bar" :aria-label="t('filtros')">
        <div class="chips">
          <button
            v-for="section in sectionsList"
            :key="section.id"
            type="button"
            class="chip"
            :class="{ selected: selectedSection === section.id }"
            @click="selectSection(section.id)"
          >
            {{ section.label }}
          </button>
        </div>
      </nav>

      <div v-if="sectionsList.length === 0 && searchQuery" class="state-box">
        <span class="state-emoji" aria-hidden="true">🔍</span>
        <p>{{ t('sinResultados') }} para “{{ searchQuery }}”</p>
      </div>

      <section v-if="filteredBundles.length > 0" id="section-featured" class="series-section">
        <div class="series-head">
          <h2 class="series-title">{{ t('packsDestacados') }}</h2>
          <span class="series-count">{{ filteredBundles.length }}</span>
        </div>
        <div class="cosmetics-grid">
          <BundleCard
            v-for="bundle in filteredBundles"
            :key="bundle.offerId"
            :bundle="bundle"
            @select="openPurchaseModal"
          />
        </div>
      </section>

      <section v-if="newCosmetics.length > 0" id="section-new" class="series-section">
        <div class="series-head">
          <h2 class="series-title">{{ t('loMasNuevo') }}</h2>
          <span class="series-count">{{ newCosmetics.length }}</span>
        </div>
        <div class="cosmetics-grid">
          <CosmeticCard
            v-for="cosmetic in newCosmetics"
            :key="cosmetic.offerId"
            :cosmetic="cosmetic"
            @select="openPurchaseModal"
          />
        </div>
      </section>

      <section v-for="section in groupedBySeriesCosmetics" :key="section.name" :id="sectionId(section.name)" class="series-section">
        <div class="series-head">
          <h2 class="series-title">{{ section.name }}</h2>
          <span class="series-count">{{ countItems(section) }}</span>
        </div>

        <!-- Cosméticos sin conjunto (set) dentro de la sección -->
        <div v-if="section.cosmetics.length || section.bundles.length" class="cosmetics-grid">
          <BundleCard
            v-for="bundle in section.bundles"
            :key="'bundle-' + bundle.offerId"
            :bundle="bundle"
            @select="openPurchaseModal"
          />
          <CosmeticCard
            v-for="cosmetic in section.cosmetics"
            :key="cosmetic.offerId"
            :cosmetic="cosmetic"
            @select="openPurchaseModal"
          />
        </div>

        <!-- Subsecciones (conjuntos) dentro de la sección -->
        <div v-for="sub in section.subsections" :key="sub.name" class="series-subsection">
          <h3 class="subsection-title">{{ sub.name }}</h3>
          <div class="cosmetics-grid">
            <BundleCard
              v-for="bundle in sub.bundles"
              :key="'bundle-' + bundle.offerId"
              :bundle="bundle"
              @select="openPurchaseModal"
            />
            <CosmeticCard
              v-for="cosmetic in sub.cosmetics"
              :key="cosmetic.offerId"
              :cosmetic="cosmetic"
              @select="openPurchaseModal"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- Modal de Compra de Cosméticos -->
    <PurchaseModal
      :isOpen="showPurchaseModal"
      :cosmetic="selectedCosmetic"
      @close="showPurchaseModal = false"
      @add-to-cart="handleAddToCart"
    />

    <!-- Modal de Compra de Bundles -->
    <BundlePurchaseModal
      :isOpen="showBundlePurchaseModal"
      :bundle="selectedBundle"
      @close="showBundlePurchaseModal = false"
      @add-to-cart="handleAddToCart"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import CosmeticCard from './CosmeticCard.vue';
import PurchaseModal from './PurchaseModal.vue';
import BundleCard from './BundleCard.vue';
import BundlePurchaseModal from './BundlePurchaseModal.vue';
import { useReactiveLanguage, getLanguage } from '../utils/useLanguage';
import { useCart } from '../composables/useCart';

const { t, lang } = useReactiveLanguage();
const { addToCart } = useCart();

// Mapeo de nuestro código de idioma al código de la API de Fortnite
const apiLangMap = {
  es: 'es',
  en: 'en',
  fr: 'fr',
  pt: 'pt-BR'
};

const getApiLang = () => apiLangMap[lang.value] || 'es';

const cosmetics = ref([]);
const bundles = ref([]);
const loading = ref(true);
const error = ref(null);
const showPurchaseModal = ref(false);
const showBundlePurchaseModal = ref(false);
const selectedCosmetic = ref(null);
const selectedBundle = ref(null);
const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
});

// ===== Filtro por secciones =====

// Normaliza el tipo a minúsculas para comparar categorías
const normalizeType = (type) => (type || '').toLowerCase();

// Etiquetas legibles para cada categoría (clave en minúsculas)
const CATEGORY_LABELS = {
  outfit: 'Skins',
  backpack: 'Mochilas',
  backbling: 'Mochilas',
  pickaxe: 'Picos',
  emote: 'Emotes',
  glider: 'Alas Delta',
  wrap: 'Envoltorios',
  music: 'Música',
  contrail: 'Estelas',
  loadingscreen: 'Pantallas de Carga',
  loading_screen: 'Pantallas de Carga',
  spray: 'Aerosoles',
  toy: 'Juguetes',
  pet: 'Mascotas',
  banner: 'Banners',
  // Cosmeticos de autos (tienda / catalogo)
  body: 'Carrocerías',
  skin: 'Pieles',
  decal: 'Calcomanías',
  boost: 'Turbos',
  wheel: 'Ruedas',
  wheels: 'Ruedas',
  sidekick: 'Compañeros',
  shoe: 'Calzado',
};

const getCategoryLabel = (type) => {
  const key = normalizeType(type);
  return CATEGORY_LABELS[key] || type;
};

// Genera un id estable para una sección a partir de su nombre
const sectionId = (name) => {
  const slug = String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `section-${slug}`;
};

// Lista de todas las secciones renderizadas, en el mismo orden en que aparecen en pantalla
const sectionsList = computed(() => {
  const list = [];

  if (filteredBundles.value.length > 0) {
    list.push({ id: 'section-featured', label: t('packsDestacados') });
  }
  if (newCosmetics.value.length > 0) {
    list.push({ id: 'section-new', label: t('loMasNuevo') });
  }
  groupedBySeriesCosmetics.value.forEach(section => {
    list.push({ id: sectionId(section.name), label: section.name });
  });

  return list;
});

const selectedSection = ref(null);

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const selectSection = (id) => {
  selectedSection.value = id;
  scrollToSection(id);
};

const countItems = (section) =>
  section.cosmetics.length +
  section.bundles.length +
  section.subsections.reduce((n, sub) => n + sub.cosmetics.length + sub.bundles.length, 0);

// Filtrar cosméticos por búsqueda
const filteredCosmetics = computed(() => {
  const query = props.searchQuery.trim().toLowerCase();

  return cosmetics.value.filter(cosmetic => {
    // Filtro por búsqueda
    if (query) {
      const nameMatch = cosmetic.name.toLowerCase().includes(query);
      const seriesMatch = (cosmetic.series || '').toLowerCase().includes(query);
      const layoutMatch = (cosmetic.layout || '').toLowerCase().includes(query);
      
      return nameMatch || seriesMatch || layoutMatch;
    }

    return true;
  });
});

// Filtrar bundles por búsqueda y ordenar de mayor a menor precio
const filteredBundles = computed(() => {
  const query = props.searchQuery.trim().toLowerCase();

  const result = bundles.value.filter(bundle => {
    // Filtro por búsqueda
    if (query) {
      const nameMatch = bundle.name.toLowerCase().includes(query);
      const itemsMatch = (bundle.items || []).some(item =>
        item.name.toLowerCase().includes(query)
      );
      
      return nameMatch || itemsMatch;
    }

    return true;
  });

  // Ordenar de mayor a menor precio
  return [...result].sort((a, b) => b.price - a.price);
});

// Ordena los cosméticos de una sección: primero las skins (outfit) y luego de mayor a menor precio
const sortCosmetics = (list) => {
  return [...list].sort((a, b) => {
    const aIsSkin = normalizeType(a.type) === 'outfit' ? 0 : 1;
    const bIsSkin = normalizeType(b.type) === 'outfit' ? 0 : 1;
    if (aIsSkin !== bIsSkin) return aIsSkin - bIsSkin;
    return b.price - a.price;
  });
};

// Mapa conjunto (set) -> serie, para agrupar artículos cuyo set pertenece a una serie
// aunque el artículo en sí no traiga el campo series (inconsistencias de la API).
const setToSeries = computed(() => {
  const map = {};
  cosmetics.value.forEach(c => {
    if (c.series && c.set && !map[c.set]) {
      map[c.set] = c.series;
    }
  });
  bundles.value.forEach(b => {
    if (b.series && b.set && !map[b.set]) {
      map[b.set] = b.series;
    }
  });
  return map;
});

// Resuelve la serie de un artículo: usa su series o, si no tiene, el mapa set->serie.
const resolveSeries = (item) => {
  const series = item.series || '';
  if (series) return series;
  const set = item.set || '';
  return (set && setToSeries.value[set]) || '';
};

// Determina si una sección contiene únicamente música
const isMusicOnlySection = (section) => {
  if (section.bundles.length > 0) return false;
  if (section.cosmetics.some(c => c.type !== 'Music')) return false;
  return section.subsections.every(sub =>
    sub.bundles.length === 0 && sub.cosmetics.every(c => c.type === 'Music')
  );
};

const groupedBySeriesCosmetics = computed(() => {
  const sections = {};
  
  // Cosméticos individuales
  filteredCosmetics.value.forEach(cosmetic => {
    const seriesName = resolveSeries(cosmetic) || cosmetic.layout || '';
    if (!seriesName) return;
    
    if (!sections[seriesName]) {
      sections[seriesName] = { name: seriesName, cosmetics: [], bundles: [], subsections: {} };
    }
    
    // Si el cosmético pertenece a un conjunto (set), se agrupa en una subsección
    const subName = cosmetic.set || '';
    if (subName) {
      if (!sections[seriesName].subsections[subName]) {
        sections[seriesName].subsections[subName] = { name: subName, cosmetics: [], bundles: [] };
      }
      sections[seriesName].subsections[subName].cosmetics.push(cosmetic);
    } else {
      sections[seriesName].cosmetics.push(cosmetic);
    }
  });
  
  // Bundles relacionados: se agrupan por series/layout igual que los cosméticos
  filteredBundles.value.forEach(bundle => {
    const seriesName = resolveSeries(bundle) || bundle.layout || bundle.name || '';
    if (!seriesName) return;
    
    if (!sections[seriesName]) {
      sections[seriesName] = { name: seriesName, cosmetics: [], bundles: [], subsections: {} };
    }
    
    const subName = bundle.set || '';
    if (subName) {
      if (!sections[seriesName].subsections[subName]) {
        sections[seriesName].subsections[subName] = { name: subName, cosmetics: [], bundles: [] };
      }
      sections[seriesName].subsections[subName].bundles.push(bundle);
    } else {
      sections[seriesName].bundles.push(bundle);
    }
  });
  
  // Ordenar el contenido de cada sección:
  // cosméticos: skins primero y luego de mayor a menor precio
  // bundles: de mayor a menor precio
  const result = Object.keys(sections).map(key => {
    const section = sections[key];
    
    section.cosmetics = sortCosmetics(section.cosmetics);
    section.bundles = [...section.bundles].sort((a, b) => b.price - a.price);
    
    const subsections = Object.keys(section.subsections).map(subKey => {
      const sub = section.subsections[subKey];
      sub.cosmetics = sortCosmetics(sub.cosmetics);
      sub.bundles = [...sub.bundles].sort((a, b) => b.price - a.price);
      return sub;
    });
    
    return {
      name: section.name,
      cosmetics: section.cosmetics,
      bundles: section.bundles,
      subsections
    };
  });
  
  // Mover las secciones que contienen solo música al final de la página
  result.sort((a, b) => {
    const aMusicOnly = isMusicOnlySection(a);
    const bMusicOnly = isMusicOnlySection(b);
    if (aMusicOnly && !bMusicOnly) return 1;
    if (!aMusicOnly && bMusicOnly) return -1;
    return 0;
  });
  
  return result;
});

const newCosmetics = computed(() => {
  const result = filteredCosmetics.value.filter(cosmetic => cosmetic.isNew === true);
  // Skins primero y luego de mayor a menor precio
  return sortCosmetics(result);
});

const openPurchaseModal = (item) => {
  // Detectar si es un bundle o un cosmético
  if (item.items && Array.isArray(item.items)) {
    // Es un bundle
    selectedBundle.value = item;
    showBundlePurchaseModal.value = true;
  } else {
    // Es un cosmético individual
    selectedCosmetic.value = item;
    showPurchaseModal.value = true;
  }
};

const handleAddToCart = (cosmetic) => {
  addToCart(cosmetic);
};

// Extrae las imágenes de render (entry.newDisplayAsset.renderImages) para el carrusel.
// Cada entrada tiene productTag/fileName/image; solo nos interesan las URLs.
const getRenderImages = (entry) => {
  const renderImages = entry?.newDisplayAsset?.renderImages;
  if (!Array.isArray(renderImages) || renderImages.length === 0) return [];

  return renderImages
    .map((render) => render?.image)
    .filter((image) => typeof image === 'string' && image);
};

const fetchCosmetics = async () => {
  try {
    loading.value = true;
    error.value = null;

    const apiLang = getApiLang();
    const response = await fetch(`https://fortnite-api.com/v2/shop?language=${apiLang}`);
    const data = await response.json();

    if (data.status !== 200) {
      throw new Error(t('errorApi'));
    }

    const entries = data.data.entries;
    const mappedCosmetics = [];
    const mappedBundles = [];

    // Recopilar todos los conjuntos (sets) disponibles para poder asociar las canciones
    const knownSets = new Set();
    entries.forEach(entry => {
      (entry.brItems || []).forEach(item => {
        if (item.set?.value) knownSets.add(item.set.value);
      });
      (entry.cars || []).forEach(car => {
        if (car.set?.value) knownSets.add(car.set.value);
      });
    });

    // Dado el nombre de un layout, devuelve el conjunto (set) si coincide con uno conocido
    const layoutToSet = (layoutName) => {
      const trimmed = (layoutName || '').trim();
      return knownSets.has(trimmed) ? trimmed : '';
    };

    // Primera pasada: detectar bundles
    entries.slice(0, 500).forEach(entry => {
      if (entry.bundle && entry.brItems && entry.brItems.length > 1) {
        // Es un pack - creamos un objeto bundle
        const bundleItems = entry.brItems.map(item => ({
          name: item.name,
          type: item.type.value,
          rarity: item.rarity?.value || 'common'
        }));
        
        mappedBundles.push({
          offerId: entry.offerId,
          name: entry.bundle.name,
          imageUrl: entry.bundle.image,
          renderImages: getRenderImages(entry),
          price: entry.finalPrice,
          regularPrice: entry.regularPrice,
          items: bundleItems,
          series: entry.brItems.map(i => i.series?.value).find(s => s) || '',
          set: entry.brItems.map(i => i.set?.value).find(s => s) || '',
          layout: entry.layout?.name || entry.bundle?.name || '',
          isNew: entry.banner?.backendValue === 'New',
          inDate: entry.inDate,
          outDate: entry.outDate,
        });
      } else if (entry.cars && entry.cars.length > 1) {
        // Es un bundle de autos (carrocería + calcas/pieles + ruedas)
        const bundleItems = entry.cars.map(car => ({
          name: car.name,
          type: car.type.value,
          rarity: car.rarity?.value || 'common'
        }));
        
        mappedBundles.push({
          offerId: entry.offerId,
          name: entry.bundle?.name || entry.cars[0]?.name,
          imageUrl: entry.bundle?.image || entry.cars[0]?.images?.large || entry.cars[0]?.images?.small || 'https://via.placeholder.com/200',
          renderImages: getRenderImages(entry),
          price: entry.finalPrice,
          regularPrice: entry.regularPrice,
          items: bundleItems,
          series: entry.cars.map(c => c.series?.value).find(s => s) || '',
          set: entry.cars.map(c => c.set?.value).find(s => s) || layoutToSet(entry.layout?.name),
          layout: entry.layout?.name || entry.bundle?.name || '',
          isNew: entry.banner?.backendValue === 'New',
          inDate: entry.inDate,
          outDate: entry.outDate,
        });
        
        // Marcar la entrada para no procesar sus autos como ítems individuales
        entry._processedAsCarBundle = true;
      }
    });

    // Segunda pasada: procesar cosméticos individuales
    entries.slice(0, 500).forEach(entry => {
      // Procesar brItems (outfits, emotes, etc.)
      if (entry.brItems && entry.brItems.length > 0) {
        entry.brItems.forEach(item => {
          
          mappedCosmetics.push({
            offerId: entry.offerId,
            name: item.name,
            type: item.type.value,
            series: item.series?.value || '',
            set: item.set?.value || '',
            layout: entry.layout?.name || '',
            rarity: item.rarity?.value || item.rarity?.displayValue?.toLowerCase() || 'common',
            price: entry.finalPrice,
            imageUrl: item.images?.featured || item.images?.icon || 'https://via.placeholder.com/200',
            // Los renderImages viven a nivel de entrada (entry.newDisplayAsset),
            // solo se aplican a cosméticos individuales, no a los ítems de un bundle.
            renderImages: (entry.bundle && entry.brItems.length > 1) ? [] : getRenderImages(entry),
            regularPrice: entry.regularPrice,
            isNew: entry.banner?.backendValue === 'New',
            inDate: entry.inDate,
            outDate: entry.outDate,
          });
        });
      }

      // Procesar autos individuales (cuerpos, pieles, ruedas, etc.)
      if (entry.cars && entry.cars.length > 0 && !entry._processedAsCarBundle) {
        entry.cars.forEach(car => {
          
          mappedCosmetics.push({
            offerId: entry.offerId,
            name: car.name,
            type: car.type.value,
            series: car.series?.value || '',
            set: car.set?.value || layoutToSet(entry.layout?.name),
            layout: entry.layout?.name || entry.bundle?.name || getCategoryLabel(car.type.value) || '',
            rarity: car.rarity?.value || car.rarity?.displayValue?.toLowerCase() || 'common',
            price: entry.finalPrice,
            imageUrl: car.images?.large || car.images?.small || entry.bundle?.image || 'https://via.placeholder.com/200',
            regularPrice: entry.regularPrice,
            isNew: entry.banner?.backendValue === 'New',
            inDate: entry.inDate,
            outDate: entry.outDate,
          });
        });
      }

      // Procesar tracks (música)
      if (entry.tracks && entry.tracks.length > 0) {
        const trackLayout = (entry.layout?.name || '').trim();
        // Si el layout coincide con un conjunto conocido, la canción pertenece a ese set
        const trackSet = knownSets.has(trackLayout) ? trackLayout : '';

        entry.tracks.forEach(track => {
          
          mappedCosmetics.push({
            offerId: entry.offerId,
            name: track.title,
            type: 'Music',
            series: '',
            set: trackSet,
            layout: entry.layout?.name || 'Jam Tracks',
            rarity: 'uncommon',
            price: entry.finalPrice,
            imageUrl: track.albumArt || 'https://via.placeholder.com/200',
            regularPrice: entry.regularPrice,
            isNew: entry.banner?.backendValue === 'New',
            inDate: entry.inDate,
            outDate: entry.outDate,
          });
        });
      }
    });

    cosmetics.value = mappedCosmetics;
    bundles.value = mappedBundles;
    
    // Eliminar cosméticos duplicados: si hay varios con el mismo nombre,
    // nos quedamos solo con el de menor precio (eliminamos los más caros)
    const cosmeticsByName = {};
    
    mappedCosmetics.forEach(cosmetic => {
      if (!cosmeticsByName[cosmetic.name]) {
        cosmeticsByName[cosmetic.name] = [];
      }
      cosmeticsByName[cosmetic.name].push(cosmetic);
    });
    
    const deduplicatedCosmetics = [];
    
    Object.keys(cosmeticsByName).forEach(name => {
      const group = cosmeticsByName[name];
      if (group.length > 1) {
        // Quedarse solo con el de menor precio
        const minPrice = Math.min(...group.map(c => c.price));
        const cheapest = group.find(c => c.price === minPrice);
        if (cheapest) {
          deduplicatedCosmetics.push(cheapest);
        }
      } else {
        deduplicatedCosmetics.push(group[0]);
      }
    });
    
    cosmetics.value = deduplicatedCosmetics;
    bundles.value = mappedBundles;
    
    return; // Salir para no asignar de nuevo al final
    
  } catch (err) {
    console.error('Error fetching cosmetics:', err);
    error.value = t('errorCarga');
    // Cargar datos de respaldo si falla la API
    loadFallbackData();
  } finally {
    loading.value = false;
  }
};

const loadFallbackData = () => {
  // Datos de respaldo en caso de que falle la API
  const fallbackData = [
    {
      offerId: '1',
      name: 'Everlong',
      type: 'Emote',
      rarity: 'Legendary',
      price: 500,
      imageUrl: 'https://via.placeholder.com/200?text=Everlong',
      isNew: true,
    },
  ];

  cosmetics.value = fallbackData;
};

onMounted(() => {
  fetchCosmetics();
});

// Re-fetch cuando cambia el idioma
watch(lang, () => {
  fetchCosmetics();
});
</script>

<style scoped>
.store-section {
  position: relative;
}

/* ===== Cargando: tarjetas esqueleto ===== */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.loading-text {
  color: var(--ink-3);
  font-size: 14px;
  font-weight: 600;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
  width: 100%;
}

.skeleton-card {
  padding: 8px 8px 16px;
  border-radius: var(--r-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.skeleton-art,
.skeleton-line {
  background: linear-gradient(90deg, var(--surface-3) 0%, var(--surface-2) 50%, var(--surface-3) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.3s linear infinite;
}

.skeleton-art {
  aspect-ratio: 6 / 5;
  border-radius: var(--r-md);
}

.skeleton-line {
  height: 14px;
  margin: 14px 8px 0;
  border-radius: 999px;
}

.skeleton-line.short {
  width: 45%;
  height: 22px;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* ===== Estados vacíos / error ===== */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 56px 20px;
  border-radius: var(--r-xl);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  color: var(--ink-2);
  font-weight: 600;
  text-align: center;
}

.state-emoji {
  font-size: 40px;
}

/* ===== Barra de chips de secciones ===== */
.filter-bar {
  position: sticky;
  top: 76px;
  z-index: 50;
  margin: -6px -20px 24px;
  padding: 10px 20px;
  background: linear-gradient(180deg, var(--bg) 70%, transparent);
}

.chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  mask-image: linear-gradient(90deg, #000 92%, transparent);
}

.chips::-webkit-scrollbar {
  display: none;
}

.chip {
  flex-shrink: 0;
  height: 36px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--ink-2);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.chip:hover {
  border-color: var(--brand-100);
  color: var(--brand);
}

.chip.selected {
  border-color: var(--brand);
  background: var(--brand);
  color: #fff;
}

/* ===== Secciones ===== */
.series-section {
  margin-bottom: 48px;
  scroll-margin-top: 140px;
}

.series-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.series-title {
  font-size: 26px;
}

.series-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 26px;
  padding: 0 9px;
  border-radius: 999px;
  background: var(--brand-50);
  color: var(--brand);
  font-size: 13px;
  font-weight: 800;
}

.series-subsection {
  margin-top: 26px;
}

.series-subsection:first-of-type {
  margin-top: 0;
}

.cosmetics-grid + .series-subsection {
  margin-top: 26px;
}

.subsection-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  color: var(--ink-2);
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0;
}

.subsection-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line);
}

.cosmetics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}

@media (max-width: 767px) {
  .filter-bar {
    top: 58px;
    margin: -6px -10px 16px;
    padding: 8px 10px;
  }

  .chip {
    height: 32px;
    padding: 0 12px;
    font-size: 12px;
  }

  .series-section {
    margin-bottom: 32px;
    scroll-margin-top: 110px;
  }

  .series-title {
    font-size: 20px;
  }

  .cosmetics-grid,
  .skeleton-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}
</style>
