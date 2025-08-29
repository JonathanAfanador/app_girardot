const formatColombiaTime = (date) => {
  if (!date) return null;
  
  // Si la fecha viene como string de PostgreSQL (UTC)
  const d = new Date(date);
  
  // Ajustar a hora Colombia (UTC-5)
  const offset = 5 * 60 * 60 * 1000; // 5 horas en milisegundos
  const colombiaTime = new Date(d.getTime() - offset);
  
  return colombiaTime.toISOString()
    .replace('T', ' ')
    .replace(/\..+/, '');
};

const parseToUTC = (dateString) => {
  const d = new Date(dateString);
  // Forzar interpretación como hora Colombia
  const offset = 5 * 60 * 60 * 1000;
  return new Date(d.getTime() + offset).toISOString()
    .replace('T', ' ')
    .replace(/\..+/, '');
};

module.exports = {
  formatColombiaTime,
  parseToUTC
};