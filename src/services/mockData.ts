import { Empresario, Negocio, Rubro, Vendedor, Cliente, ProductoServicio, Venta, DashboardResumen, VentasPeriodoData, TopVendedorData } from '../types';

export const mockEmpresarios: Empresario[] = [
  { id: 'emp-01', nombre: 'Carlos', apellido: 'Mendoza', correo: 'carlos.mendoza@techgroup.sv', telefono: '+503 7890-1122', estado: 'ACTIVO', createdAt: '2025-01-10T08:00:00.000Z' },
  { id: 'emp-02', nombre: 'Elena', apellido: 'Rivas', correo: 'elena.rivas@beautyspa.sv', telefono: '+503 7654-3344', estado: 'ACTIVO', createdAt: '2025-01-15T09:30:00.000Z' },
  { id: 'emp-03', nombre: 'Roberto', apellido: 'Gómez', correo: 'roberto.gomez@healthplus.sv', telefono: '+503 7123-5566', estado: 'ACTIVO', createdAt: '2025-02-01T10:15:00.000Z' },
  { id: 'emp-04', nombre: 'Mariana', apellido: 'López', correo: 'mariana.lopez@eduverse.sv', telefono: '+503 7987-7788', estado: 'ACTIVO', createdAt: '2025-02-10T14:20:00.000Z' },
  { id: 'emp-05', nombre: 'Fernando', apellido: 'Torres', correo: 'fernando.torres@buildco.sv', telefono: '+503 7456-9900', estado: 'ACTIVO', createdAt: '2025-02-20T11:00:00.000Z' },
];

export const mockNegocios: Negocio[] = [
  { id: 'neg-01', empresarioId: 'emp-01', nombre: 'Comercial ABC', rubro: 'Multiservicios', telefono: '+503 2233-4455', correo: 'info@comercialabc.sv', porcentajeGanancia: 15.0, estado: 'ACTIVO', createdAt: '2025-01-11T09:00:00.000Z', empresario: mockEmpresarios[0] },
  { id: 'neg-02', empresarioId: 'emp-01', nombre: 'Innovatech Digital', rubro: 'Servicios Profesionales', telefono: '+503 2233-4456', correo: 'contacto@innovatech.sv', porcentajeGanancia: 12.5, estado: 'ACTIVO', createdAt: '2025-01-12T10:00:00.000Z', empresario: mockEmpresarios[0] },
  { id: 'neg-03', empresarioId: 'emp-02', nombre: 'Luxe Beauty & Spa', rubro: 'Belleza', telefono: '+503 2244-5566', correo: 'citas@luxebeauty.sv', porcentajeGanancia: 20.0, estado: 'ACTIVO', createdAt: '2025-01-16T11:00:00.000Z', empresario: mockEmpresarios[1] },
  { id: 'neg-04', empresarioId: 'emp-03', nombre: 'HealthPlus Clinic', rubro: 'Salud', telefono: '+503 2255-6677', correo: 'atencion@healthplus.sv', porcentajeGanancia: 18.0, estado: 'ACTIVO', createdAt: '2025-02-02T12:00:00.000Z', empresario: mockEmpresarios[2] },
  { id: 'neg-05', empresarioId: 'emp-04', nombre: 'EduVerse Academy', rubro: 'Educación', telefono: '+503 2266-7788', correo: 'admisiones@eduverse.sv', porcentajeGanancia: 25.0, estado: 'ACTIVO', createdAt: '2025-02-11T15:00:00.000Z', empresario: mockEmpresarios[3] },
  { id: 'neg-06', empresarioId: 'emp-05', nombre: 'BuildCo Constructora', rubro: 'Construcción', telefono: '+503 2277-8899', correo: 'ventas@buildco.sv', porcentajeGanancia: 10.0, estado: 'ACTIVO', createdAt: '2025-02-21T16:00:00.000Z', empresario: mockEmpresarios[4] },
];

export const mockRubros: Rubro[] = [
  { id: 'rub-01', negocioId: 'neg-01', nombre: 'Librería', descripcion: 'Útiles escolares, libros y oficina', estado: 'ACTIVO', createdAt: '2025-01-12T00:00:00.000Z', negocio: mockNegocios[0] },
  { id: 'rub-02', negocioId: 'neg-01', nombre: 'Papelería', descripcion: 'Hojas, cuadernos y papelería corporativa', estado: 'ACTIVO', createdAt: '2025-01-12T00:00:00.000Z', negocio: mockNegocios[0] },
  { id: 'rub-03', negocioId: 'neg-01', nombre: 'Tecnología', descripcion: 'Cómputo, accesorios y licencias', estado: 'ACTIVO', createdAt: '2025-01-12T00:00:00.000Z', negocio: mockNegocios[0] },
  { id: 'rub-04', negocioId: 'neg-01', nombre: 'Impresiones', descripcion: 'Impresión digital y fotocopias', estado: 'ACTIVO', createdAt: '2025-01-12T00:00:00.000Z', negocio: mockNegocios[0] },
  { id: 'rub-05', negocioId: 'neg-02', nombre: 'Desarrollo Software', descripcion: 'Sistemas a medida NestJS/React', estado: 'ACTIVO', createdAt: '2025-01-13T00:00:00.000Z', negocio: mockNegocios[1] },
  { id: 'rub-06', negocioId: 'neg-03', nombre: 'Estética & Spa', descripcion: 'Faciales, masajes y relajación', estado: 'ACTIVO', createdAt: '2025-01-17T00:00:00.000Z', negocio: mockNegocios[2] },
];

export const mockVendedores: Vendedor[] = [
  { id: 'vend-01', empresarioId: 'emp-01', negocioId: 'neg-01', rubroId: 'rub-01', nombre: 'Carlos', apellido: 'López', correo: 'carlos.lopez@ginozzi.com', telefono: '+503 7000-1001', dui: '01000000-1', estado: 'ACTIVO', fechaCreacion: '2025-01-12T00:00:00.000Z', negocio: mockNegocios[0], rubro: mockRubros[0], _count: { clientes: 12, ventas: 48 } },
  { id: 'vend-02', empresarioId: 'emp-01', negocioId: 'neg-01', rubroId: 'rub-01', nombre: 'María', apellido: 'Rodríguez', correo: 'maria.rodriguez@ginozzi.com', telefono: '+503 7000-1002', dui: '01000000-2', estado: 'ACTIVO', fechaCreacion: '2025-01-13T00:00:00.000Z', negocio: mockNegocios[0], rubro: mockRubros[0], _count: { clientes: 15, ventas: 62 } },
  { id: 'vend-03', empresarioId: 'emp-01', negocioId: 'neg-01', rubroId: 'rub-01', nombre: 'Pedro', apellido: 'Hernández', correo: 'pedro.hernandez@ginozzi.com', telefono: '+503 7000-1003', dui: '01000000-3', estado: 'ACTIVO', fechaCreacion: '2025-01-14T00:00:00.000Z', negocio: mockNegocios[0], rubro: mockRubros[0], _count: { clientes: 9, ventas: 35 } },
  { id: 'vend-04', empresarioId: 'emp-01', negocioId: 'neg-01', rubroId: 'rub-01', nombre: 'Ana', apellido: 'Martínez', correo: 'ana.martinez@ginozzi.com', telefono: '+503 7000-1004', dui: '01000000-4', estado: 'ACTIVO', fechaCreacion: '2025-01-15T00:00:00.000Z', negocio: mockNegocios[0], rubro: mockRubros[0], _count: { clientes: 18, ventas: 89 } },
  { id: 'vend-05', empresarioId: 'emp-02', negocioId: 'neg-03', rubroId: 'rub-06', nombre: 'Valeria', apellido: 'Rivas', correo: 'valeria.rivas@ginozzi.com', telefono: '+503 7000-1005', dui: '01000000-5', estado: 'ACTIVO', fechaCreacion: '2025-02-03T00:00:00.000Z', negocio: mockNegocios[2], rubro: mockRubros[5], _count: { clientes: 14, ventas: 53 } },
];

export const mockClientes: Cliente[] = [
  { id: 'cli-01', empresarioId: 'emp-01', negocioId: 'neg-01', rubroId: 'rub-01', vendedorId: 'vend-01', nombre: 'Juan', apellido: 'Pérez', telefono: '+503 7123-4567', correo: 'juan.perez@gmail.com', dui: '02345678-1', direccion: 'San Salvador, Av. Roosevelt #102', observaciones: 'Cliente frecuente de librería', estado: 'ACTIVO', createdAt: '2025-01-15T00:00:00.000Z', vendedor: mockVendedores[0] },
  { id: 'cli-02', empresarioId: 'emp-01', negocioId: 'neg-01', rubroId: 'rub-01', vendedorId: 'vend-02', nombre: 'Ana', apellido: 'Gómez', telefono: '+503 7234-5678', correo: 'ana.gomez@hotmail.com', dui: '03456789-2', direccion: 'Santa Tecla, Res. El Carmen #45', observaciones: 'Compras corporativas', estado: 'ACTIVO', createdAt: '2025-01-18T00:00:00.000Z', vendedor: mockVendedores[1] },
  { id: 'cli-03', empresarioId: 'emp-01', negocioId: 'neg-01', rubroId: 'rub-01', vendedorId: 'vend-03', nombre: 'Carlos', apellido: 'Ruiz', telefono: '+503 7345-6789', correo: 'carlos.ruiz@yahoo.com', dui: '04567890-3', direccion: 'Antiguo Cuscatlán #12', observaciones: 'Prefiere facturación crédito', estado: 'ACTIVO', createdAt: '2025-01-20T00:00:00.000Z', vendedor: mockVendedores[2] },
];

export const mockProductosServicios: ProductoServicio[] = [
  { id: 'ps-01', empresarioId: 'emp-01', negocioId: 'neg-01', rubroId: 'rub-01', nombre: 'Cuaderno Engargolado 200 Hojas', descripcion: 'Cuaderno profesional de espiral doble.', codigo: 'LIB-001', tipo: 'PRODUCTO', precio: 4.50, estado: 'ACTIVO', createdAt: '2025-01-11T00:00:00.000Z', negocio: mockNegocios[0] },
  { id: 'ps-02', empresarioId: 'emp-01', negocioId: 'neg-01', rubroId: 'rub-01', nombre: 'Lápiz Grafito #2 (Caja 12)', descripcion: 'Caja de 12 lápices escolares.', codigo: 'LIB-002', tipo: 'PRODUCTO', precio: 3.00, estado: 'ACTIVO', createdAt: '2025-01-11T00:00:00.000Z', negocio: mockNegocios[0] },
  { id: 'ps-03', empresarioId: 'emp-01', negocioId: 'neg-01', rubroId: 'rub-03', nombre: 'Mouse Inalámbrico Ergonómico', descripcion: 'Sensor óptico 1600 DPI.', codigo: 'TEC-001', tipo: 'PRODUCTO', precio: 22.00, estado: 'ACTIVO', createdAt: '2025-01-12T00:00:00.000Z', negocio: mockNegocios[0] },
];

export const mockVentas: Venta[] = [
  {
    id: 'vta-0001',
    empresarioId: 'emp-01',
    negocioId: 'neg-01',
    rubroId: 'rub-01',
    vendedorId: 'vend-01',
    clienteId: 'cli-01',
    fechaVenta: '2026-03-01T10:30:00.000Z',
    subtotal: 45.0,
    descuento: 5.0,
    total: 40.0,
    porcentajeGanancia: 15.0,
    montoGanancia: 6.0,
    observaciones: 'Venta registrada desde App Móvil por Carlos López.',
    estado: 'COMPLETADA',
    empresario: mockEmpresarios[0],
    negocio: mockNegocios[0],
    rubro: mockRubros[0],
    vendedor: mockVendedores[0],
    cliente: mockClientes[0],
    detalles: [
      { id: 'det-01', ventaId: 'vta-0001', productoServicioId: 'ps-01', nombreProductoSnapshot: 'Cuaderno Engargolado 200 Hojas', cantidad: 10, precioUnitario: 4.50, descuento: 5.0, subtotal: 40.0, productoServicio: mockProductosServicios[0] },
    ],
  },
  {
    id: 'vta-0002',
    empresarioId: 'emp-01',
    negocioId: 'neg-01',
    rubroId: 'rub-01',
    vendedorId: 'vend-02',
    clienteId: 'cli-02',
    fechaVenta: '2026-03-02T14:15:00.000Z',
    subtotal: 150.0,
    descuento: 0,
    total: 150.0,
    porcentajeGanancia: 15.0,
    montoGanancia: 22.5,
    observaciones: 'Venta de papelería corporativa.',
    estado: 'COMPLETADA',
    empresario: mockEmpresarios[0],
    negocio: mockNegocios[0],
    rubro: mockRubros[0],
    vendedor: mockVendedores[1],
    cliente: mockClientes[1],
    detalles: [
      { id: 'det-02', ventaId: 'vta-0002', productoServicioId: 'ps-02', nombreProductoSnapshot: 'Lápiz Grafito #2 (Caja 12)', cantidad: 50, precioUnitario: 3.00, descuento: 0, subtotal: 150.0, productoServicio: mockProductosServicios[1] },
    ],
  },
];

export const mockDashboardResumen: DashboardResumen = {
  kpis: {
    totalEmpresarios: 10,
    totalNegocios: 15,
    totalRubros: 30,
    totalVendedores: 30,
    vendedoresActivos: 30,
    totalClientes: 200,
    ventasMesCount: 142,
    ventasMesTotal: 48950.0,
    gananciasMesTotal: 8321.5,
    ventasAcumuladasTotal: 342890.0,
    gananciasAcumuladasTotal: 58290.0,
    promedioTicket: 344.71,
  },
};

export const mockVentasPeriodo: VentasPeriodoData[] = [
  { periodo: 'Ene 2025', totalVentas: 18500.0, ganancias: 3145.0, cantidad: 52 },
  { periodo: 'Feb 2025', totalVentas: 22400.0, ganancias: 3808.0, cantidad: 64 },
  { periodo: 'Mar 2025', totalVentas: 26800.0, ganancias: 4556.0, cantidad: 78 },
  { periodo: 'Abr 2025', totalVentas: 24100.0, ganancias: 4097.0, cantidad: 71 },
  { periodo: 'May 2025', totalVentas: 29500.0, ganancias: 5015.0, cantidad: 89 },
  { periodo: 'Jun 2025', totalVentas: 31200.0, ganancias: 5304.0, cantidad: 94 },
  { periodo: 'Jul 2025', totalVentas: 28900.0, ganancias: 4913.0, cantidad: 85 },
  { periodo: 'Ago 2025', totalVentas: 34500.0, ganancias: 5865.0, cantidad: 102 },
  { periodo: 'Sep 2025', totalVentas: 38200.0, ganancias: 6494.0, cantidad: 114 },
  { periodo: 'Oct 2025', totalVentas: 41800.0, ganancias: 7106.0, cantidad: 125 },
  { periodo: 'Nov 2025', totalVentas: 45300.0, ganancias: 7701.0, cantidad: 136 },
  { periodo: 'Dic 2025', totalVentas: 51200.0, ganancias: 8704.0, cantidad: 155 },
  { periodo: 'Ene 2026', totalVentas: 43500.0, ganancias: 7395.0, cantidad: 128 },
  { periodo: 'Feb 2026', totalVentas: 46200.0, ganancias: 7854.0, cantidad: 135 },
  { periodo: 'Mar 2026', totalVentas: 48950.0, ganancias: 8321.5, cantidad: 142 },
];

export const mockTopVendedores: TopVendedorData[] = [
  { id: 'vend-01', nombre: 'Carlos López', negocio: 'Comercial ABC', rubro: 'Librería', totalVendido: 15200.0, totalGanancias: 2280.0, cantidadVentas: 48, cantidadClientes: 12 },
  { id: 'vend-02', nombre: 'María Rodríguez', negocio: 'Comercial ABC', rubro: 'Librería', totalVendido: 14100.0, totalGanancias: 2115.0, cantidadVentas: 62, cantidadClientes: 15 },
  { id: 'vend-04', nombre: 'Ana Martínez', negocio: 'Comercial ABC', rubro: 'Librería', totalVendido: 12800.0, totalGanancias: 1920.0, cantidadVentas: 89, cantidadClientes: 18 },
  { id: 'vend-03', nombre: 'Pedro Hernández', negocio: 'Comercial ABC', rubro: 'Librería', totalVendido: 9500.0, totalGanancias: 1425.0, cantidadVentas: 35, cantidadClientes: 9 },
];
