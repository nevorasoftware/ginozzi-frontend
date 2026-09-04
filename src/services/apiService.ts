import { apiClient } from '../api/client';
import { Empresario, Negocio, Vendedor, Cliente, ProductoServicio, Venta, DashboardResumen, VentasPeriodoData, TopVendedorData } from '../types';

export const apiService = {
  // Auth
  login: async (correo: string, contrasena: string) => {
    const res = await apiClient.post('/auth/login', { correo, contrasena });
    return res.data;
  },
  getProfile: async () => {
    const res = await apiClient.get('/auth/profile');
    return res.data;
  },

  // Empresarios
  getEmpresarios: async () => {
    const res = await apiClient.get<Empresario[]>('/empresarios');
    return res.data;
  },
  createEmpresario: async (data: Partial<Empresario>) => {
    const res = await apiClient.post<Empresario>('/empresarios', data);
    return res.data;
  },
  updateEmpresario: async (id: string, data: Partial<Empresario>) => {
    const res = await apiClient.patch<Empresario>(`/empresarios/${id}`, data);
    return res.data;
  },
  toggleEmpresarioStatus: async (id: string, estado: 'ACTIVO' | 'INACTIVO') => {
    const res = await apiClient.patch<Empresario>(`/empresarios/${id}/status`, { estado });
    return res.data;
  },

  // Negocios
  getNegocios: async (empresarioId?: string) => {
    const res = await apiClient.get<Negocio[]>('/negocios', { params: { empresarioId } });
    return res.data;
  },
  createNegocio: async (data: Partial<Negocio>) => {
    const res = await apiClient.post<Negocio>('/negocios', data);
    return res.data;
  },
  updateNegocio: async (id: string, data: Partial<Negocio>) => {
    const res = await apiClient.patch<Negocio>(`/negocios/${id}`, data);
    return res.data;
  },
  toggleNegocioStatus: async (id: string, estado: 'ACTIVO' | 'INACTIVO') => {
    const res = await apiClient.patch<Negocio>(`/negocios/${id}/status`, { estado });
    return res.data;
  },

  // Vendedores
  getVendedores: async (negocioId?: string) => {
    const res = await apiClient.get<Vendedor[]>('/vendedores', { params: { negocioId } });
    return res.data;
  },
  createVendedor: async (data: Partial<Vendedor> & { contrasena?: string }) => {
    const res = await apiClient.post<Vendedor>('/vendedores', data);
    return res.data;
  },
  updateVendedor: async (id: string, data: Partial<Vendedor>) => {
    const res = await apiClient.patch<Vendedor>(`/vendedores/${id}`, data);
    return res.data;
  },
  toggleVendedorStatus: async (id: string, estado: 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO') => {
    const res = await apiClient.patch<Vendedor>(`/vendedores/${id}/status`, { estado });
    return res.data;
  },
  getVendedorStats: async (id: string) => {
    const res = await apiClient.get(`/vendedores/${id}/estadisticas`);
    return res.data;
  },

  // Clientes
  getClientes: async (vendedorId?: string) => {
    const res = await apiClient.get<Cliente[]>('/clientes', { params: { vendedorId } });
    return res.data;
  },
  createCliente: async (data: Partial<Cliente>) => {
    const res = await apiClient.post<Cliente>('/clientes', data);
    return res.data;
  },

  // Productos & Servicios
  getProductosServicios: async (negocioId?: string, tipo?: string) => {
    const res = await apiClient.get<ProductoServicio[]>('/productos-servicios', { params: { negocioId, tipo } });
    return res.data;
  },
  createProductoServicio: async (data: Partial<ProductoServicio>) => {
    const res = await apiClient.post<ProductoServicio>('/productos-servicios', data);
    return res.data;
  },

  // Ventas
  getVentas: async (params?: { negocioId?: string; vendedorId?: string; clienteId?: string; estado?: string }) => {
    const res = await apiClient.get<Venta[]>('/ventas', { params });
    return res.data;
  },
  createVenta: async (data: any) => {
    const res = await apiClient.post<Venta>('/ventas', data);
    return res.data;
  },
  anularVenta: async (id: string) => {
    const res = await apiClient.patch<Venta>(`/ventas/${id}/anular`);
    return res.data;
  },

  // Dashboard API
  getDashboardResumen: async () => {
    const res = await apiClient.get<DashboardResumen>('/dashboard/resumen');
    return res.data;
  },
  getVentasPeriodo: async (from?: string, to?: string, groupBy: string = 'month') => {
    const res = await apiClient.get<VentasPeriodoData[]>('/dashboard/ventas-periodo', { params: { from, to, groupBy } });
    return res.data;
  },
  getTopVendedores: async (limit: number = 5, from?: string, to?: string) => {
    const res = await apiClient.get<TopVendedorData[]>('/dashboard/top-vendedores', { params: { limit, from, to } });
    return res.data;
  },
  getRendimientoVendedores: async (negocioId?: string, vendedorId?: string) => {
    const res = await apiClient.get('/dashboard/rendimiento-vendedores', { params: { negocioId, vendedorId } });
    return res.data;
  },
};
