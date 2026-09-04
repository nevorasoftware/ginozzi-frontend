export type Role = 'SUPER_ADMIN' | 'EMPRESARIO' | 'VENDEDOR';

export interface User {
  id: string;
  correo: string;
  nombre: string;
  apellido: string;
  role: Role;
  empresarioId?: string;
  vendedorId?: string;
  negocioId?: string;
}

export interface Empresario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  estado: 'ACTIVO' | 'INACTIVO';
  createdAt: string;
  negocios?: Negocio[];
}

export interface Negocio {
  id: string;
  empresarioId: string;
  nombre: string;
  rubro?: string;
  telefono: string;
  correo: string;
  porcentajeGanancia: number;
  estado: 'ACTIVO' | 'INACTIVO';
  createdAt: string;
  empresario?: Empresario;
  rubros?: Rubro[];
  vendedores?: Vendedor[];
}

export interface Rubro {
  id: string;
  negocioId: string;
  nombre: string;
  descripcion?: string;
  estado: 'ACTIVO' | 'INACTIVO';
  createdAt: string;
  negocio?: Negocio;
  vendedores?: Vendedor[];
  productosServicios?: ProductoServicio[];
}

export interface Vendedor {
  id: string;
  empresarioId?: string;
  negocioId: string;
  rubroId?: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  dui: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO';
  fechaCreacion: string;
  empresario?: Empresario;
  negocio?: Negocio;
  rubro?: Rubro;
  _count?: { clientes: number; ventas: number };
}

export interface Cliente {
  id: string;
  empresarioId?: string;
  negocioId?: string;
  rubroId?: string;
  vendedorId: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  dui?: string;
  direccion?: string;
  observaciones?: string;
  estado: 'ACTIVO' | 'INACTIVO';
  createdAt: string;
  empresario?: Empresario;
  negocio?: Negocio;
  rubro?: Rubro;
  vendedor?: Vendedor;
}

export interface ProductoServicio {
  id: string;
  empresarioId?: string;
  negocioId: string;
  rubroId?: string;
  nombre: string;
  descripcion?: string;
  codigo?: string;
  tipo: 'PRODUCTO' | 'SERVICIO';
  precio: number;
  estado: 'ACTIVO' | 'INACTIVO';
  createdAt: string;
  empresario?: Empresario;
  negocio?: Negocio;
  rubro?: Rubro;
}

export interface VentaDetalle {
  id: string;
  ventaId: string;
  productoServicioId: string;
  nombreProductoSnapshot?: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
  productoServicio?: ProductoServicio;
}

export interface Venta {
  id: string;
  empresarioId?: string;
  negocioId: string;
  rubroId?: string;
  vendedorId: string;
  clienteId: string;
  fechaVenta: string;
  subtotal: number;
  descuento: number;
  total: number;
  porcentajeGanancia: number;
  montoGanancia: number;
  observaciones?: string;
  estado: 'COMPLETADA' | 'ANULADA' | 'PENDIENTE';
  empresario?: Empresario;
  negocio?: Negocio;
  rubro?: Rubro;
  vendedor?: Vendedor;
  cliente?: Cliente;
  detalles?: VentaDetalle[];
}

export interface DashboardResumen {
  kpis: {
    totalEmpresarios: number;
    totalNegocios: number;
    totalRubros?: number;
    totalVendedores: number;
    vendedoresActivos: number;
    totalClientes: number;
    ventasMesCount: number;
    ventasMesTotal: number;
    gananciasMesTotal: number;
    ventasAcumuladasTotal: number;
    gananciasAcumuladasTotal: number;
    promedioTicket?: number;
  };
}

export interface VentasPeriodoData {
  periodo: string;
  totalVentas: number;
  ganancias: number;
  cantidad: number;
}

export interface TopVendedorData {
  id: string;
  nombre: string;
  negocio: string;
  rubro: string;
  totalVendido: number;
  totalGanancias: number;
  cantidadVentas: number;
  cantidadClientes: number;
}

export interface FilterState {
  period: '1M' | '3M' | '6M' | '12M' | 'custom';
  empresarioIds: string[];
  negocioIds: string[];
  rubroIds: string[];
  vendedorIds: string[];
  from?: string;
  to?: string;
}
