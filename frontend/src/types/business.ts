interface Business {
  id: number;
  name: string;
  address: string;
  phone?: string;
  category: string;
  description?: string;
}

interface Event {
  id_evento: number;
  nombre: string;
  fecha_inicio: string;
  // ...
}

interface Promotion {
  id_promocion: number;
  nombre_prom: string;
  descuento: number;
  // ...
}

// Nuevas interfaces para el formulario y backend
interface BusinessFromBackend {
  id_negocio: number;
  nombre: string;
  direccion: string;
  telefono: string;
  id_categoria: number;
  descripcion: string;
  id_usuario: number;
}

type BusinessFormData = {
  nombre: string;
  direccion: string;
  telefono: string;
  id_categoria: number;
  descripcion: string;
};

export type { Business, Event, Promotion, BusinessFromBackend, BusinessFormData };