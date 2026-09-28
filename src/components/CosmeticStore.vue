<template>
  <section class="store-section">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p class="loading-text">{{ t('cargandoCosmeticos') }}</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <div class="filter-bar">
        <div class="category-dropdown" ref="categoryDropdown">
          <button
            type="button"
            class="category-dropdown__trigger"
            :class="{ open: isCategoryOpen }"
            @click="toggleCategoryDropdown"
          >
            <span class="category-dropdown__label">{{ selectedCategoryLabel }}</span>
            <svg
              class="category-dropdown__icon"
              :class="{ open: isCategoryOpen }"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <transition name="dropdown">
            <ul v-if="isCategoryOpen" class="category-dropdown__panel">
              <li
                v-for="cat in availableCategories"
                :key="cat.value"
                class="category-dropdown__option"
                :class="{ selected: selectedCategory === cat.value }"
                @click="selectCategory(cat.value)"
              >
                <span>{{ cat.label }}</span>
                <svg
                  v-if="selectedCategory === cat.value"
                  class="category-dropdown__check"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </li>
            </ul>
          </transition>
        </div>
      </div>

      <section v-if="selectedCategory === 'all' && filteredBundles.length > 0" class="series-section">
        <h2 class="series-title">{{ t('packsDestacados') }}</h2>
        <div class="cosmetics-grid">
          <BundleCard
            v-for="bundle in filteredBundles"
            :key="bundle.offerId"
            :bundle="bundle"
            @select="openPurchaseModal"
          />
        </div>
      </section>

      <section v-if="newCosmetics.length > 0" class="series-section">
        <h2 class="series-title">{{ t('loMasNuevo') }}</h2>
        <div class="cosmetics-grid">
          <CosmeticCard
            v-for="cosmetic in newCosmetics"
            :key="cosmetic.offerId"
            :cosmetic="cosmetic"
            @select="openPurchaseModal"
          />
        </div>
      </section>

      <section v-for="section in groupedBySeriesCosmetics" :key="section.name" class="series-section">
        <h2 class="series-title">{{ section.name }}</h2>

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

      <section v-for="(series, seriesName) in musicCosmetics" :key="'music-' + seriesName" class="series-section">
        <h2 class="series-title">{{ seriesName }}</h2>
        <div class="cosmetics-grid">
          <CosmeticCard
            v-for="cosmetic in series"
            :key="cosmetic.offerId"
            :cosmetic="cosmetic"
            @select="openPurchaseModal"
          />
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import CosmeticCard from './CosmeticCard.vue';
import PurchaseModal from './PurchaseModal.vue';
import BundleCard from './BundleCard.vue';
import BundlePurchaseModal from './BundlePurchaseModal.vue';
import { useReactiveLanguage, getLanguage } from '../utils/useLanguage';

const { t, lang } = useReactiveLanguage();

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
const selectedCategory = ref('all');

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
});

// ===== Filtro por categorías =====

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

// Orden preferido de las categorías
const CATEGORY_ORDER = [
  'outfit', 'backpack', 'backbling', 'pickaxe', 'emote', 'glider', 'wrap',
  'music', 'contrail', 'loadingscreen', 'loading_screen', 'spray', 'toy', 'pet', 'banner',
  'body', 'skin', 'decal', 'boost', 'wheel', 'wheels'
];

const availableCategories = computed(() => {
  const types = new Set();
  cosmetics.value.forEach(c => { if (c.type) types.add(normalizeType(c.type)); });
  bundles.value.forEach(b => (b.items || []).forEach(i => { if (i.type) types.add(normalizeType(i.type)); }));

  const ordered = CATEGORY_ORDER.filter(t => types.has(t));
  types.forEach(t => { if (!ordered.includes(t)) ordered.push(t); });

  const list = [{ value: 'all', label: t('todasLasCategorias') }];
  ordered.forEach(t => {
    list.push({ value: t, label: getCategoryLabel(t) });
  });
  return list;
});

// Etiqueta de la categoría seleccionada para el botón del desplegable
const selectedCategoryLabel = computed(() => {
  if (selectedCategory.value === 'all') return t('todasLasCategorias');
  return getCategoryLabel(selectedCategory.value);
});

const isCategoryOpen = ref(false);
const categoryDropdown = ref(null);

const toggleCategoryDropdown = () => {
  isCategoryOpen.value = !isCategoryOpen.value;
};

const selectCategory = (value) => {
  selectedCategory.value = value;
  isCategoryOpen.value = false;
};

const handleClickOutside = (event) => {
  if (categoryDropdown.value && !categoryDropdown.value.contains(event.target)) {
    isCategoryOpen.value = false;
  }
};

// Filtrar cosméticos por búsqueda y categoría
const filteredCosmetics = computed(() => {
  const query = props.searchQuery.trim().toLowerCase();

  return cosmetics.value.filter(cosmetic => {
    // Filtro por categoría
    if (selectedCategory.value !== 'all' && normalizeType(cosmetic.type) !== selectedCategory.value) {
      return false;
    }

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

// Filtrar bundles por búsqueda y categoría, y ordenar de mayor a menor precio
const filteredBundles = computed(() => {
  const query = props.searchQuery.trim().toLowerCase();

  const result = bundles.value.filter(bundle => {
    // Filtro por categoría: el pack pertenece a la categoría si contiene algún item de ese tipo
    if (selectedCategory.value !== 'all') {
      const hasCategory = (bundle.items || []).some(item =>
        normalizeType(item.type) === selectedCategory.value
      );
      if (!hasCategory) return false;
    }

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

const groupedBySeriesCosmetics = computed(() => {
  const sections = {};
  
  // Cosméticos individuales (excluyendo música)
  filteredCosmetics.value.forEach(cosmetic => {
    if (cosmetic.type === 'Music') return;
    
    const seriesName = cosmetic.series || cosmetic.layout || '';
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
    const seriesName = bundle.series || bundle.layout || bundle.name || '';
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
  
  return result;
});

const musicCosmetics = computed(() => {
  const grouped = {};
  
  filteredCosmetics.value.forEach(cosmetic => {
    // Solo agrupar música
    if (cosmetic.type !== 'Music') return;
    
    const seriesName = cosmetic.layout || 'Jam Tracks';
    if (!grouped[seriesName]) {
      grouped[seriesName] = [];
    }
    grouped[seriesName].push(cosmetic);
  });
  
  // Eliminar secciones sin nombre
  delete grouped[''];
  
  // En cada sección: ordenar de mayor a menor precio
  Object.keys(grouped).forEach(key => {
    grouped[key] = sortCosmetics(grouped[key]);
  });
  
  return grouped;
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
  // Emitir evento hacia el componente padre (App.vue) con el producto
  const event = new CustomEvent('add-to-cart', { detail: cosmetic });
  window.dispatchEvent(event);
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
          price: entry.finalPrice,
          regularPrice: entry.regularPrice,
          items: bundleItems,
          series: entry.cars.map(c => c.series?.value).find(s => s) || '',
          set: entry.cars.map(c => c.set?.value).find(s => s) || '',
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
            set: car.set?.value || '',
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
        entry.tracks.forEach(track => {
          
          mappedCosmetics.push({
            offerId: entry.offerId,
            name: track.title,
            type: 'Music',
            series: '',
            set: '',
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
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Re-fetch cuando cambia el idioma
watch(lang, () => {
  fetchCosmetics();
});
</script>

<style scoped>
.store-section {
  position: relative;
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.store-header {
  margin-bottom: 40px;
  text-align: center;
}

.store-header h2 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #FF6B00, #FF8C42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.loading-text {
  margin: 0;
  color: #ffffff;
  font-size: 18px;
}

.Sponsor{
    display: flex;
    align-items: left;
    justify-content: left;
    gap: 8px;
}

.store-subtitle {
  margin: 0; 
  padding-bottom: 50px;
  
  /* 2. Forzamos a que el texto NO rompa línea */
  white-space: nowrap; 
  
  color: #ffffff;
  font-size: 50px;
  
  /* 3. El peso máximo estándar es 900 */
  font-weight: 900; 
  letter-spacing: -4px;       /* Junta un poco las letras */
  line-height: 1;
  font-style: oblique;
  
  /* 4. Opcional: Centrarlo si es necesario */
  text-align: left;
  width: 100%;
}

.series-title {
  margin: 0 0 55px 0; 
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  
  /* 2. Forzamos a que el texto NO rompa línea */
  white-space: nowrap; 
  
  color: #ffffff;
  font-size: 100px;
  
  /* 3. El peso máximo estándar es 900 */
  font-weight: 900; 
  letter-spacing: -4px;       /* Junta un poco las letras */
  line-height: 1;
  font-style: oblique;
  text-transform: uppercase;
  
  /* 4. Opcional: Centrarlo si es necesario */
  text-align: left;
  width: 100%;
}

.Store-sponsor {
  margin: 0;
  font-size: 20px;
  color: #ffffff;
  letter-spacing: 0.5px;
  text-align: left;
  font-weight: 800;
  letter-spacing: 0px; 
  padding-bottom: 20px;
}

.cosmetics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px 20px;
  row-gap: 160px;
}

/* Ajustar a 4 columnas exactas */
@media (min-width: 1024px) {
  .cosmetics-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px 20px;
    row-gap: 100px;
  }
  .series-title {
    font-size: 40px;
    letter-spacing: -1px;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .cosmetics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px 20px;
    row-gap: 60px;
  }
   .series-title {
    font-size: 25px;
    margin-bottom: 25px;
    letter-spacing: -1px;
  }
}

@media (max-width: 767px) {
  .cosmetics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    row-gap: 40px;
  }
   .series-title {
    font-size: 18px;
    margin-bottom: 25px;
    letter-spacing: -1px;
  }

  .store-header h2 {
    font-size: 18px;
  }

  .store-section {
    padding: 10px 8px;
  }

  .store-header {
    margin-bottom: 10px;
  }

  .Sponsor img {
    width: 18px;
    height: 18px;
  }

  .Store-sponsor {
    font-size: 10px;
    padding-bottom: 6px;
  }
}


.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  color: #f87171;
  font-size: 18px;
  ont-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
}

.error p {
  margin: 0;
}

/* Filtro por categorías */
.filter-bar {
  position: absolute;
  top: 40px;
  right: 20px;
  z-index: 5;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
}

.category-dropdown {
  position: relative;
  min-width: 220px;
}

.category-dropdown__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 10px 18px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  color: #b0b0b0;
  font-size: 15px;
  font-weight: 700;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  outline: none;
  box-sizing: border-box;
}

.category-dropdown__trigger:hover {
  border-color: rgba(255, 140, 0, 0.5);
  color: #FF8C00;
  background: rgba(255, 140, 0, 0.1);
}

.category-dropdown__trigger.open {
  border-color: #FF8C00;
  color: #FF8C00;
  background: #2a1a0a;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 6px 18px rgba(255, 140, 0, 0.25);
}

.category-dropdown__icon {
  flex-shrink: 0;
  transition: transform 0.22s ease;
}

.category-dropdown__icon.open {
  transform: rotate(180deg);
}

.category-dropdown__panel {
  position: absolute;
  top: calc(100% - 2px);
  left: 0;
  width: 100%;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: #2a1a0a;
  border: 2px solid #FF8C00;
  border-top: none;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);
  z-index: 20;
  max-height: 340px;
  overflow-y: auto;
  box-sizing: border-box;
}

.category-dropdown__panel::-webkit-scrollbar {
  width: 6px;
}

.category-dropdown__panel::-webkit-scrollbar-thumb {
  background: rgba(255, 140, 0, 0.4);
  border-radius: 999px;
}

.category-dropdown__panel::-webkit-scrollbar-track {
  background: transparent;
}

.category-dropdown__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  color: #d3d3d3;
  font-size: 14px;
  font-weight: 700;
  font-family: 'Burbank Big Condensed', 'Arial Black', sans-serif;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.category-dropdown__option:hover {
  background: rgba(255, 140, 0, 0.16);
  color: #FF8C00;
}

.category-dropdown__option.selected {
  color: #FF8C00;
}

.category-dropdown__check {
  flex-shrink: 0;
  color: #FF8C00;
}

/* Transición del panel desplegable */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

@media (max-width: 767px) {
  .filter-bar {
    position: static;
    justify-content: stretch;
    margin-bottom: 20px;
  }

  .category-dropdown {
    width: 100%;
    min-width: 0;
  }

  .category-dropdown__trigger {
    padding: 8px 16px;
    font-size: 13px;
  }
}

/* Estilos para secciones de series */
.series-section {
  margin-bottom: 80px;
}

.series-subsection {
  margin-bottom: 50px;
}

.subsection-title {
  margin: 0;
  padding-bottom: 30px;
  white-space: normal;
  color: #ffffff;
  font-size: 32px;
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1.1;
  font-style: oblique;
  text-transform: uppercase;
  text-align: left;
  width: 100%;
}

@media (max-width: 1023px) and (min-width: 768px) {
  .subsection-title {
    font-size: 22px;
  }
}



@media (max-width: 767px) {
  .series-title {
    font-size: 18px;
    margin-bottom: 25px;
    letter-spacing: -1px;
    white-space: normal;
  }
  
  .series-section {
    margin-bottom: 30px;
  }

  .series-subsection {
    margin-bottom: 25px;
  }

  .subsection-title {
    font-size: 18px;
    padding-bottom: 20px;
  }
}
</style>