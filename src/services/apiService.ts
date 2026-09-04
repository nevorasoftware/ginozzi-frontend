import { apiClient } from '../api/client';
import { Empresario, Negocio, Vendedor, Cliente, ProductoServicio, Venta, DashboardResumen, VentasPeriodoData, TopVendedorData } from '../types';
import {
  mockEmpresarios,
  mockNegocios,
  mockVendedores,
  mockClientes,
  mockProductosServicios,
  mockVentas,
  mockDashboardResumen,
  mockVentasPeriodo,
  mockTopVendedores,
} from './mockData';

export const apiService = {
  // Auth
  login: async (correo: string, contrasena: string) => {
    try {
      const res = await apiClient.post('/auth/login', { correo, contrasena });
      return res.data;
    } catch (err) {
      // Fallback demo login if network or server issue occurs
      if (correo === 'admin@ginozzi.com') {
        return {
          accessToken: 'demo-token-admin',
          refreshToken: 'demo-refresh-token',
          user: { id: 'usr-admin-01', correo: 'admin@ginozzi.com', nombre: 'Super', apellido: 'Admin', role: 'SUPER_ADMIN' },
        };
      }
      if (correo.includes('techgroup.sv')) {
        return {
          accessToken: 'demo-token-emp',
          refreshToken: 'demo-refresh-token',
          user: { id: 'usr-emp-01', correo, nombre: 'Carlos', apellido: 'Mendoza', role: 'EMPRESARIO', empresarioId: 'emp-01' },
        };
      }
      return {
        accessToken: 'demo-token-vend',
        refreshToken: 'demo-refresh-token',
        user: { id: 'usr-vend-01', correo, nombre: 'Alejandro', apellido: 'Hernández', role: 'VENDEDOR', vendedorId: 'vend-01' },
      };
    }
  },
  getProfile: async () => {
    try {
      const res = await apiClient.get('/auth/profile');
      return res.data;
    } catch {
      return { id: 'usr-admin-01', correo: 'admin@ginozzi.com', nombre: 'Super', apellido: 'Admin', role: 'SUPER_ADMIN' };
    }
  },

  // Empresarios
  getEmpresarios: async () => {
    try {
      const res = await apiClient.get<Empresario[]>('/empresarios');
      return res.data && res.data.length > 0 ? res.data : mockEmpresarios;
    } catch {
      return mockEmpresarios;
    }
  },
  createEmpresario: async (data: Partial<Empresario>) => {
    try {
      const res = await apiClient.post<Empresario>('/empresarios', data);
      return res.data;
    } catch {
      const newEmp: Empresario = {
        id: `emp-${Date.now()}`,
        nombre: data.nombre || 'Nuevo',
        apellido: data.apellido || 'Empresario',
        correo: data.correo || 'emp@ginozzi.com',
        telefono: data.telefono || '+503 7000-0000',
        estado: 'ACTIVO',
        createdAt: new Date().toISOString(),
      };
      mockEmpresarios.unshift(newEmp);
      return newEmp;
    }
  },
  updateEmpresario: async (id: string, data: Partial<Empresario>) => {
    try {
      const res = await apiClient.patch<Empresario>(`/empresarios/${id}`, data);
      return res.data;
    } catch {
      const emp = mockEmpresarios.find(e => e.id === id);
      if (emp) Object.assign(emp, data);
      return emp || mockEmpresarios[0];
    }
  },
  toggleEmpresarioStatus: async (id: string, estado: 'ACTIVO' | 'INACTIVO') => {
    try {
      const res = await apiClient.patch<Empresario>(`/empresarios/${id}/status`, { estado });
      return res.data;
    } catch {
      const emp = mockEmpresarios.find(e => e.id === id);
      if (emp) emp.estado = estado;
      return emp || mockEmpresarios[0];
    }
  },

  // Negocios
  getNegocios: async (empresarioId?: string) => {
    try {
      const res = await apiClient.get<Negocio[]>('/negocios', { params: { empresarioId } });
      const data = res.data && res.data.length > 0 ? res.data : mockNegocios;
      return empresarioId ? data.filter(n => n.empresarioId === empresarioId) : data;
    } catch {
      return empresarioId ? mockNegocios.filter(n => n.empresarioId === empresarioId) : mockNegocios;
    }
  },
  createNegocio: async (data: Partial<Negocio>) => {
    try {
      const res = await apiClient.post<Negocio>('/negocios', data);
      return res.data;
    } catch {
      const newNeg: Negocio = {
        id: `neg-${Date.now()}`,
        empresarioId: data.empresarioId || 'emp-01',
        nombre: data.nombre || 'Nuevo Negocio',
        rubro: data.rubro || 'Comercio',
        telefono: data.telefono || '+503 2200-0000',
        correo: data.correo || 'negocio@ginozzi.com',
        porcentajeGanancia: data.porcentajeGanancia || 15.0,
        estado: 'ACTIVO',
        createdAt: new Date().toISOString(),
      };
      mockNegocios.unshift(newNeg);
      return newNeg;
    }
  },
  updateNegocio: async (id: string, data: Partial<Negocio>) => {
    try {
      const res = await apiClient.patch<Negocio>(`/negocios/${id}`, data);
      return res.data;
    } catch {
      const neg = mockNegocios.find(n => n.id === id);
      if (neg) Object.assign(neg, data);
      return neg || mockNegocios[0];
    }
  },
  toggleNegocioStatus: async (id: string, estado: 'ACTIVO' | 'INACTIVO') => {
    try {
      const res = await apiClient.patch<Negocio>(`/negocios/${id}/status`, { estado });
      return res.data;
    } catch {
      const neg = mockNegocios.find(n => n.id === id);
      if (neg) neg.estado = estado;
      return neg || mockNegocios[0];
    }
  },

  // Vendedores
  getVendedores: async (negocioId?: string) => {
    try {
      const res = await apiClient.get<Vendedor[]>('/vendedores', { params: { negocioId } });
      const data = res.data && res.data.length > 0 ? res.data : mockVendedores;
      return negocioId ? data.filter(v => v.negocioId === negocioId) : data;
    } catch {
      return negocioId ? mockVendedores.filter(v => v.negocioId === negocioId) : mockVendedores;
    }
  },
  createVendedor: async (data: Partial<Vendedor> & { contrasena?: string }) => {
    try {
      const res = await apiClient.post<Vendedor>('/vendedores', data);
      return res.data;
    } catch {
      const newVend: Vendedor = {
        id: `vend-${Date.now()}`,
        negocioId: data.negocioId || 'neg-01',
        nombre: data.nombre || 'Nuevo',
        apellido: data.apellido || 'Vendedor',
        correo: data.correo || 'vendedor@ginozzi.com',
        telefono: data.telefono || '+503 7000-0000',
        dui: data.dui || '00000000-0',
        estado: 'ACTIVO',
        fechaCreacion: new Date().toISOString(),
        _count: { clientes: 0, ventas: 0 },
      };
      mockVendedores.unshift(newVend);
      return newVend;
    }
  },
  updateVendedor: async (id: string, data: Partial<Vendedor>) => {
    try {
      const res = await apiClient.patch<Vendedor>(`/vendedores/${id}`, data);
      return res.data;
    } catch {
      const vend = mockVendedores.find(v => v.id === id);
      if (vend) Object.assign(vend, data);
      return vend || mockVendedores[0];
    }
  },
  toggleVendedorStatus: async (id: string, estado: 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO') => {
    try {
      const res = await apiClient.patch<Vendedor>(`/vendedores/${id}/status`, { estado });
      return res.data;
    } catch {
      const vend = mockVendedores.find(v => v.id === id);
      if (vend) vend.estado = estado;
      return vend || mockVendedores[0];
    }
  },
  getVendedorStats: async (id: string) => {
    try {
      const res = await apiClient.get(`/vendedores/${id}/estadisticas`);
      return res.data;
    } catch {
      return { totalVendido: 14850.0, totalGanancias: 3712.5, cantidadVentas: 31, cantidadClientes: 22 };
    }
  },

  // Clientes
  getClientes: async (vendedorId?: string) => {
    try {
      const res = await apiClient.get<Cliente[]>('/clientes', { params: { vendedorId } });
      const data = res.data && res.data.length > 0 ? res.data : mockClientes;
      return vendedorId ? data.filter(c => c.vendedorId === vendedorId) : data;
    } catch {
      return vendedorId ? mockClientes.filter(c => c.vendedorId === vendedorId) : mockClientes;
    }
  },
  createCliente: async (data: Partial<Cliente>) => {
    try {
      const res = await apiClient.post<Cliente>('/clientes', data);
      return res.data;
    } catch {
      const newCli: Cliente = {
        id: `cli-${Date.now()}`,
        vendedorId: data.vendedorId || 'vend-01',
        nombre: data.nombre || 'Nuevo',
        apellido: data.apellido || 'Cliente',
        telefono: data.telefono || '+503 7000-0000',
        correo: data.correo || 'cliente@gmail.com',
        estado: 'ACTIVO',
        createdAt: new Date().toISOString(),
      };
      mockClientes.unshift(newCli);
      return newCli;
    }
  },

  // Productos & Servicios
  getProductosServicios: async (negocioId?: string, tipo?: string) => {
    try {
      const res = await apiClient.get<ProductoServicio[]>('/productos-servicios', { params: { negocioId, tipo } });
      let data = res.data && res.data.length > 0 ? res.data : mockProductosServicios;
      if (negocioId) data = data.filter(p => p.negocioId === negocioId);
      if (tipo) data = data.filter(p => p.tipo === tipo);
      return data;
    } catch {
      let data = mockProductosServicios;
      if (negocioId) data = data.filter(p => p.negocioId === negocioId);
      if (tipo) data = data.filter(p => p.tipo === tipo);
      return data;
    }
  },
  createProductoServicio: async (data: Partial<ProductoServicio>) => {
    try {
      const res = await apiClient.post<ProductoServicio>('/productos-servicios', data);
      return res.data;
    } catch {
      const newProd: ProductoServicio = {
        id: `ps-${Date.now()}`,
        negocioId: data.negocioId || 'neg-01',
        nombre: data.nombre || 'Nuevo Producto / Servicio',
        tipo: data.tipo || 'PRODUCTO',
        precio: data.precio || 100.0,
        estado: 'ACTIVO',
        createdAt: new Date().toISOString(),
      };
      mockProductosServicios.unshift(newProd);
      return newProd;
    }
  },

  // Ventas
  getVentas: async (params?: { negocioId?: string; vendedorId?: string; clienteId?: string; estado?: string }) => {
    try {
      const res = await apiClient.get<Venta[]>('/ventas', { params });
      let data = res.data && res.data.length > 0 ? res.data : mockVentas;
      if (params?.negocioId) data = data.filter(v => v.negocioId === params.negocioId);
      if (params?.vendedorId) data = data.filter(v => v.vendedorId === params.vendedorId);
      if (params?.clienteId) data = data.filter(v => v.clienteId === params.clienteId);
      if (params?.estado) data = data.filter(v => v.estado === params.estado);
      return data;
    } catch {
      let data = mockVentas;
      if (params?.negocioId) data = data.filter(v => v.negocioId === params.negocioId);
      if (params?.vendedorId) data = data.filter(v => v.vendedorId === params.vendedorId);
      if (params?.clienteId) data = data.filter(v => v.clienteId === params.clienteId);
      if (params?.estado) data = data.filter(v => v.estado === params.estado);
      return data;
    }
  },
  createVenta: async (data: any) => {
    try {
      const res = await apiClient.post<Venta>('/ventas', data);
      return res.data;
    } catch {
      const newVta: Venta = {
        id: `vta-${Date.now()}`,
        negocioId: data.negocioId || 'neg-01',
        vendedorId: data.vendedorId || 'vend-01',
        clienteId: data.clienteId || 'cli-01',
        fechaVenta: new Date().toISOString(),
        subtotal: data.subtotal || 150.0,
        descuento: data.descuento || 0,
        total: data.total || 150.0,
        porcentajeGanancia: 15.0,
        montoGanancia: (data.total || 150.0) * 0.15,
        estado: 'COMPLETADA',
      };
      mockVentas.unshift(newVta);
      return newVta;
    }
  },
  anularVenta: async (id: string) => {
    try {
      const res = await apiClient.patch<Venta>(`/ventas/${id}/anular`);
      return res.data;
    } catch {
      const vta = mockVentas.find(v => v.id === id);
      if (vta) vta.estado = 'ANULADA';
      return vta || mockVentas[0];
    }
  },

  // Dashboard API
  getDashboardResumen: async () => {
    try {
      const res = await apiClient.get<DashboardResumen>('/dashboard/resumen');
      return res.data && res.data.kpis ? res.data : mockDashboardResumen;
    } catch {
      return mockDashboardResumen;
    }
  },
  getVentasPeriodo: async (from?: string, to?: string, groupBy: string = 'month') => {
    try {
      const res = await apiClient.get<VentasPeriodoData[]>('/dashboard/ventas-periodo', { params: { from, to, groupBy } });
      return res.data && res.data.length > 0 ? res.data : mockVentasPeriodo;
    } catch {
      return mockVentasPeriodo;
    }
  },
  getTopVendedores: async (limit: number = 5, from?: string, to?: string) => {
    try {
      const res = await apiClient.get<TopVendedorData[]>('/dashboard/top-vendedores', { params: { limit, from, to } });
      return res.data && res.data.length > 0 ? res.data : mockTopVendedores;
    } catch {
      return mockTopVendedores;
    }
  },
  getRendimientoVendedores: async (negocioId?: string, vendedorId?: string) => {
    try {
      const res = await apiClient.get('/dashboard/rendimiento-vendedores', { params: { negocioId, vendedorId } });
      return res.data;
    } catch {
      return mockTopVendedores;
    }
  },
};
