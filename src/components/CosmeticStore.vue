<template>
  <section class="store-section">
    <div class="store-header">
      <div class="Sponsor">
        <img src="../assets/epiclogo.png" alt="Epic API Logo" width="30" height="30"/>
      <p class="Store-sponsor">Powered by Epic api</p>
      </div>
    </div>
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando cosméticos...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <section v-if="newCosmetics.length > 0" class="series-section">
        <h2 class="series-title">Lo Más Nuevo</h2>
        <div class="cosmetics-grid">
          <CosmeticCard
            v-for="cosmetic in newCosmetics"
            :key="cosmetic.offerId"
            :cosmetic="cosmetic"
          />
        </div>
      </section>

      <section v-for="(series, seriesName) in groupedBySeriesCosmetics" :key="seriesName" class="series-section">
        <h2 class="series-title">{{ seriesName }}</h2>
        <div class="cosmetics-grid">
          <CosmeticCard
            v-for="cosmetic in series"
            :key="cosmetic.offerId"
            :cosmetic="cosmetic"
          />
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import CosmeticCard from './CosmeticCard.vue';

const cosmetics = ref([]);
const loading = ref(true);
const error = ref(null);

const groupedBySeriesCosmetics = computed(() => {
  const grouped = {};
  
  cosmetics.value.forEach(cosmetic => {
    const seriesName = cosmetic.series || cosmetic.layout || '';
    if (!grouped[seriesName]) {
      grouped[seriesName] = [];
    }
    grouped[seriesName].push(cosmetic);
  });
  
  return grouped;
});

const newCosmetics = computed(() => {
  return cosmetics.value.filter(cosmetic => cosmetic.isNew === true);
});

const fetchCosmetics = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await fetch('https://fortnite-api.com/v2/shop');
    const data = await response.json();

    if (data.status !== 200) {
      throw new Error('Error al obtener datos de la API');
    }

    const entries = data.data.entries;
    const mappedCosmetics = [];

    // Procesar todos los tipos de cosméticos
    entries.slice(0, 500).forEach(entry => {
      // Procesar brItems (outfits, emotes, etc.)
      if (entry.brItems && entry.brItems.length > 0) {
        entry.brItems.forEach(item => {
          mappedCosmetics.push({
            offerId: entry.offerId,
            name: item.name,
            type: item.type.value,
            series: item.series?.value || '',
            layout: entry.layout?.name || '',
            rarity: item.rarity?.displayValue || 'Común',
            price: entry.finalPrice,
            imageUrl: item.images?.featured || item.images?.icon || 'https://via.placeholder.com/200',
            regularPrice: entry.regularPrice,
            isNew: entry.banner?.backendValue === 'New',
            inDate: entry.inDate,
            outDate: entry.outDate,
          });
        });
      }

      // Procesar cars/ruedas (wheels)
      if (entry.cars && entry.cars.length > 0) {
        entry.cars.forEach(car => {
          mappedCosmetics.push({
            offerId: entry.offerId,
            name: car.name,
            type: car.type.value,
            series: car.series?.value || '',
            layout: entry.layout?.name || entry.bundle?.name || '',
            rarity: car.rarity?.displayValue || 'Común',
            price: entry.finalPrice,
            imageUrl: car.images?.large || entry.bundle?.image || 'https://via.placeholder.com/200',
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
            layout: entry.layout?.name || 'Jam Tracks',
            rarity: 'Uncommon',
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
    
  } catch (err) {
    console.error('Error fetching cosmetics:', err);
    error.value = 'No se pudieron cargar los cosméticos. Por favor, intenta de nuevo.';
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
</script>

<style scoped>
.store-section {
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
  background: linear-gradient(135deg, #aa3bff, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  margin: 0; 
  padding-bottom: 70px;
  
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
  row-gap: 360px;
}

/* Ajustar a 4 columnas exactas */
@media (min-width: 1024px) {
  .cosmetics-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px 20px;
    row-gap: 240px;
  }
  .series-title {
    font-size: 40px;
    padding: 50px 0 70px 0;
    letter-spacing: -1px;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .cosmetics-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 40px 20px;
    row-gap: 210px;
  }
   .series-title {
    font-size: 25px;
    padding-bottom: 40px;
    letter-spacing: -1px;
  }
}

@media (max-width: 767px) {
  .cosmetics-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    row-gap: 70px;
  }
   .series-title {
    font-size: 18px;
    padding-bottom: 40px;
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
  border: 4px solid rgba(170, 59, 255, 0.2);
  border-top: 4px solid #aa3bff;
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
}

.error p {
  margin: 0;
}

/* Estilos para secciones de series */
.series-section {
  margin-bottom: 80px;
}



@media (max-width: 767px) {
  .series-title {
    font-size: 18px;
    padding-bottom: 40px;
    letter-spacing: -1px;
    white-space: normal;
  }
  
  .series-section {
    margin-bottom: 30px;
  }
}
</style>
