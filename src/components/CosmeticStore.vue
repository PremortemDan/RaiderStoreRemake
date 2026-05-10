<template>
  <section class="store-section">
    <div class="store-header">
      <h2>Tienda de Cosméticos</h2>
      <p class="store-subtitle">Descubre los últimos artículos disponibles</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando cosméticos...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="cosmetics-grid">
      <CosmeticCard
        v-for="cosmetic in cosmetics"
        :key="cosmetic.offerId"
        :cosmetic="cosmetic"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CosmeticCard from './CosmeticCard.vue';

const cosmetics = ref([]);
const loading = ref(true);
const error = ref(null);

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

    // Mapear y filtrar cosméticos con imágenes
    const mappedCosmetics = entries
      .filter(entry => entry.brItems && entry.brItems.length > 0)
      .slice(0, 60) // Limitar a 60 items
      .map(entry => {
        const item = entry.brItems[0];
        return {
          offerId: entry.offerId,
          name: item.name,
          type: item.type?.displayValue || 'Cosmético',
          rarity: item.rarity?.displayValue || 'Común',
          price: entry.finalPrice,
          imageUrl: item.images?.featured || item.images?.icon || 'https://via.placeholder.com/200',
          regularPrice: entry.regularPrice,
          isNew: entry.banner?.backendValue === 'New',
          inDate: entry.inDate,
          outDate: entry.outDate,
        };
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
    {
      offerId: '2',
      name: 'Venom Fang',
      type: 'Pickaxe',
      rarity: 'Epic',
      price: 800,
      imageUrl: 'https://via.placeholder.com/200?text=Venom+Fang',
      isNew: true,
    },
    {
      offerId: '3',
      name: 'Holo-pack',
      type: 'Backpack',
      rarity: 'Rare',
      price: 400,
      imageUrl: 'https://via.placeholder.com/200?text=Holo-pack',
      isNew: false,
    },
    {
      offerId: '4',
      name: 'Starships',
      type: 'Emote',
      rarity: 'Legendary',
      price: 500,
      imageUrl: 'https://via.placeholder.com/200?text=Starships',
      isNew: false,
    },
    {
      offerId: '5',
      name: 'Pizza Party',
      type: 'Emote',
      rarity: 'Rare',
      price: 200,
      imageUrl: 'https://via.placeholder.com/200?text=Pizza+Party',
      isNew: true,
    },
    {
      offerId: '6',
      name: 'Waltz',
      type: 'Character',
      rarity: 'Epic',
      price: 800,
      imageUrl: 'https://via.placeholder.com/200?text=Waltz',
      isNew: false,
    },
    {
      offerId: '7',
      name: 'Ella Slurp',
      type: 'Character',
      rarity: 'Epic',
      price: 800,
      imageUrl: 'https://via.placeholder.com/200?text=Ella+Slurp',
      isNew: true,
    },
    {
      offerId: '8',
      name: 'Mace Windu',
      type: 'Character',
      rarity: 'Legendary',
      price: 1500,
      imageUrl: 'https://via.placeholder.com/200?text=Mace+Windu',
      isNew: false,
    },
    {
      offerId: '9',
      name: 'Moniker',
      type: 'Character',
      rarity: 'Epic',
      price: 1200,
      imageUrl: 'https://via.placeholder.com/200?text=Moniker',
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

.store-subtitle {
  margin: 0;
  color: #9ca3af;
  font-size: 16px;
}

.cosmetics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 48px 48px;
  row-gap: 80px;
}

/* Ajustar a 3 columnas exactas */
@media (min-width: 1024px) {
  .cosmetics-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 48px 48px;
    row-gap: 80px;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .cosmetics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px 40px;
    row-gap: 70px;
  }
}

@media (max-width: 767px) {
  .cosmetics-grid {
    grid-template-columns: 1fr;
    gap: 32px 32px;
    row-gap: 60px;
  }

  .store-header h2 {
    font-size: 24px;
  }

  .store-section {
    padding: 20px 16px;
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
</style>
