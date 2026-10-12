// Conversión de V-Bucks y totales. Antes estaba copiado en varios componentes.

export const calculatePriceMXN = (vbucks) => Math.floor((vbucks / 100) * 7.5);
export const calculatePriceUSD = (vbucks) => Math.floor((vbucks / 100) * 0.45);

// Precio en MXN de un artículo: usa el precio fijo (item.mxn) o lo calcula desde V-Bucks.
const itemMXN = (item) => {
  if (item.mxn) return parseFloat(item.mxn);
  if (item.price > 0) return calculatePriceMXN(item.price);
  return 0;
};

const itemUSD = (item) => {
  if (item.usd) return parseFloat(item.usd);
  if (item.price > 0) return calculatePriceUSD(item.price);
  return 0;
};

export const sumVbucks = (items) => items.reduce((sum, item) => sum + (item.price || 0), 0);
export const sumMXN = (items) => items.reduce((sum, item) => sum + itemMXN(item), 0);
export const sumUSD = (items) => items.reduce((sum, item) => sum + itemUSD(item), 0);
