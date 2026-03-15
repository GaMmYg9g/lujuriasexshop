// ============================================
// LUXURIA SHOP - LÓGICA PRINCIPAL
// ============================================

const WHATSAPP_NUMBER = "5356502201";
const TIENDA_NOMBRE = "LUJURIA SEX SHOP";

// Mapa de colores
const colorMap = {
    'morado': '#B670E0EB',
    'rosado': '#FF559EC5',
    'negro': '#000000',
    'rojo': '#F10A00',
    'azul': '#6AB6FF',
    'verde': '#097251',
    'amarillo': '#FF9D2B',
    'blanco': '#FFFFFF',
    'marrón claro': '#C19071',
    'piel': '#FFBE95',
    'transparente': 'transparent',
    'gris': '#808080',
    'plateado': '#C0C0C0',
    'dorado': '#B89B5E',
    'malva': '#BD00C2',
};

// Estado
let carrito = JSON.parse(localStorage.getItem('luxuriaCarrito')) || [];
let usuario = JSON.parse(localStorage.getItem('luxuriaUsuario')) || null;
let enFlujoCompra = false;

// Elementos DOM
const productosContainer = document.getElementById('productosContainer');
const contadorCarrito = document.getElementById('contadorCarrito');
const verCarritoBtn = document.getElementById('verCarrito');
const verPerfilBtn = document.getElementById('verPerfil');
const verAcercaBtn = document.getElementById('verAcerca');
const carritoModal = document.getElementById('carritoModal');
const cerrarCarritoBtn = document.getElementById('cerrarModal');
const carritoItems = document.getElementById('carritoItems');
const btnComprarCarrito = document.getElementById('btnComprarCarrito');
const resumenModal = document.getElementById('resumenCompraModal');
const cerrarResumenBtn = document.getElementById('cerrarResumenModal');
const resumenProductos = document.getElementById('resumenProductos');
const resumenSubtotal = document.getElementById('resumenSubtotal');
const resumenTotal = document.getElementById('resumenTotal');
const cancelarCompra = document.getElementById('cancelarCompra');
const confirmarCompra = document.getElementById('confirmarCompra');
const registroModal = document.getElementById('registroModal');
const cerrarRegistroBtn = document.getElementById('cerrarRegistroModal');
const formularioRegistro = document.getElementById('formularioRegistro');
const perfilModal = document.getElementById('perfilModal');
const cerrarPerfilBtn = document.getElementById('cerrarPerfilModal');
const formularioPerfil = document.getElementById('formularioPerfil');
const confirmacionModal = document.getElementById('confirmacionModal');
const numeroPedido = document.getElementById('numeroPedido');
const totalConfirmacion = document.getElementById('totalConfirmacion');
const seguirComprando = document.getElementById('seguirComprando');
const buscador = document.getElementById('buscador');
const categoriasContainer = document.getElementById('categorias');
const acercaModal = document.getElementById('acercaModal');
const cerrarAcercaBtn = document.getElementById('cerrarAcercaModal');
const miniNotif = document.getElementById('notificacionMini');
const miniMensaje = document.getElementById('miniMensaje');
const cerrarMini = document.getElementById('cerrarMiniNotif');
const confirmacionAccionModal = document.getElementById('confirmacionAccionModal');
const confirmacionMensaje = document.getElementById('confirmacionMensaje');
const cerrarConfirmacionAccion = document.getElementById('cerrarConfirmacionAccion');
const cancelarConfirmacion = document.getElementById('cancelarConfirmacion');
const okConfirmacion = document.getElementById('okConfirmacion');
const revisionModal = document.getElementById('revisionDatosModal');
const revNombre = document.getElementById('revNombre');
const revTelefono = document.getElementById('revTelefono');
const revProvincia = document.getElementById('revProvincia');
const revMunicipio = document.getElementById('revMunicipio');
const revZona = document.getElementById('revZona');
const revDireccion = document.getElementById('revDireccion');
const revNumero = document.getElementById('revNumero');
const editarDatosBtn = document.getElementById('editarDatosBtn');
const confirmarDatosBtn = document.getElementById('confirmarDatosBtn');
const cerrarRevisionBtn = document.getElementById('cerrarRevisionModal');

// Filtros y orden
let filtroCategoria = 'todos';
let filtroBusqueda = '';
let ordenActual = null;

// ===== PROCESAR COLORES Y OFERTAS DE PRODUCTOS =====
productosData.productos.forEach(p => {
    if (p.color) {
        p.colores = p.color.split(',').map(c => c.trim());
    } else {
        p.colores = [];
    }
    if (p.oferta === undefined) p.oferta = false;
    if (p.descuento === undefined) p.descuento = 0;
    if (p.etiquetaOferta === undefined) p.etiquetaOferta = '';
});

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    cargarProductos();
    actualizarContadorCarrito();
    
    verCarritoBtn.addEventListener('click', abrirCarrito);
    verPerfilBtn.addEventListener('click', abrirPerfil);
    verAcercaBtn.addEventListener('click', () => {
        acercaModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    cerrarAcercaBtn.addEventListener('click', () => cerrarModal(acercaModal));
    
    cerrarCarritoBtn.addEventListener('click', cerrarCarritoModal);
    btnComprarCarrito.addEventListener('click', abrirResumenCompra);
    cerrarResumenBtn.addEventListener('click', () => cerrarModal(resumenModal));
    cancelarCompra.addEventListener('click', () => cerrarModal(resumenModal));
    confirmarCompra.addEventListener('click', procesarPedido);
    cerrarRegistroBtn.addEventListener('click', () => cerrarModal(registroModal));
    formularioRegistro.addEventListener('submit', guardarRegistro);
    cerrarPerfilBtn.addEventListener('click', () => cerrarModal(perfilModal));
    formularioPerfil.addEventListener('submit', guardarPerfil);
    seguirComprando.addEventListener('click', () => cerrarModal(confirmacionModal));
    buscador.addEventListener('input', filtrarProductos);
    
    cerrarMini.addEventListener('click', ocultarMiniNotificacion);
    cerrarConfirmacionAccion.addEventListener('click', ocultarConfirmacion);
    cancelarConfirmacion.addEventListener('click', ocultarConfirmacion);
    okConfirmacion.addEventListener('click', ejecutarConfirmacion);
    
    cerrarRevisionBtn.addEventListener('click', () => {
        cerrarModal(revisionModal);
        enFlujoCompra = false;
    });
    editarDatosBtn.addEventListener('click', () => {
        cerrarModal(revisionModal);
        abrirPerfil();
    });
    confirmarDatosBtn.addEventListener('click', () => {
        cerrarModal(revisionModal);
        enFlujoCompra = false;
        enviarPedidoWhatsApp();
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === carritoModal) cerrarCarritoModal();
        if (e.target === resumenModal) cerrarModal(resumenModal);
        if (e.target === registroModal) cerrarModal(registroModal);
        if (e.target === perfilModal) cerrarModal(perfilModal);
        if (e.target === confirmacionModal) cerrarModal(confirmacionModal);
        if (e.target === acercaModal) cerrarModal(acercaModal);
        if (e.target === miniNotif) ocultarMiniNotificacion();
        if (e.target === confirmacionAccionModal) ocultarConfirmacion();
        if (e.target === revisionModal) {
            cerrarModal(revisionModal);
            enFlujoCompra = false;
        }
    });
});

// ===== MINI NOTIFICACIÓN =====
function mostrarNotificacion(mensaje) {
    miniMensaje.textContent = mensaje;
    miniNotif.classList.add('mostrar');
    setTimeout(ocultarMiniNotificacion, 2500);
}
function ocultarMiniNotificacion() {
    miniNotif.classList.remove('mostrar');
}

// ===== CONFIRMACIÓN PERSONALIZADA =====
function mostrarConfirmacion(mensaje, accion) {
    confirmacionMensaje.textContent = mensaje;
    accionConfirmar = accion;
    confirmacionAccionModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function ocultarConfirmacion() {
    confirmacionAccionModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    accionConfirmar = null;
}
function ejecutarConfirmacion() {
    if (accionConfirmar) {
        accionConfirmar();
    }
    ocultarConfirmacion();
}

// ===== CATEGORÍAS Y ORDEN =====
function cargarCategorias() {
    const todasCategorias = productosData.productos.flatMap(p => p.categorias);
    const categoriasUnicas = [...new Set(todasCategorias)].sort();
    
    let html = '';
    html += '<button class="categoria" data-orden="caro">MÁS CARO</button>';
    html += '<button class="categoria" data-orden="barato">MÁS BARATO</button>';
    html += '<button class="categoria active" data-categoria="todos">TODOS</button>';
    
    categoriasUnicas.forEach(cat => {
        html += `<button class="categoria" data-categoria="${cat}">${cat.toUpperCase()}</button>`;
    });
    
    categoriasContainer.innerHTML = html;
    
    document.querySelectorAll('.categoria').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.categoria').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.orden) {
                ordenActual = btn.dataset.orden;
            } else {
                filtroCategoria = btn.dataset.categoria;
            }
            filtrarProductos();
        });
    });
}

function ordenarProductos(array) {
    if (ordenActual === 'caro') {
        return array.sort((a, b) => b.precio - a.precio);
    } else if (ordenActual === 'barato') {
        return array.sort((a, b) => a.precio - b.precio);
    } else {
        return array.sort(ordenAlfanumerico);
    }
}

function ordenAlfanumerico(a, b) {
    const nombreA = a.nombre.toLowerCase();
    const nombreB = b.nombre.toLowerCase();
    const esNumeroA = /^\d/.test(nombreA);
    const esNumeroB = /^\d/.test(nombreB);
    if (esNumeroA && !esNumeroB) return -1;
    if (!esNumeroA && esNumeroB) return 1;
    return nombreA.localeCompare(nombreB);
}

function cargarProductos() {
    const filtrados = filtrarProductosArray();
    renderizarProductos(filtrados);
}

function filtrarProductosArray() {
    let filtrados = productosData.productos;
    if (filtroBusqueda) {
        filtrados = filtrados.filter(p => 
            p.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase())
        );
    }
    if (filtroCategoria !== 'todos') {
        filtrados = filtrados.filter(p => p.categorias.includes(filtroCategoria));
    }
    return filtrados;
}

function filtrarProductos() {
    filtroBusqueda = buscador.value;
    let filtrados = filtrarProductosArray();
    filtrados = ordenarProductos(filtrados);
    renderizarProductos(filtrados);
}

function esNuevo(fechaStr) {
    if (!fechaStr) return false;
    const fechaProducto = new Date(fechaStr);
    const ahora = new Date();
    const diffMs = ahora - fechaProducto;
    const diffHoras = diffMs / (1000 * 60 * 60);
    return diffHoras < 24;
}

function renderizarProductos(array) {
    if (!productosContainer) return;
    if (array.length === 0) {
        productosContainer.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:4rem; color:#888;">No se encontraron productos</div>';
        return;
    }
    
    productosContainer.innerHTML = array.map(p => {
        const disponible = p.disponible;
        const estadoClass = disponible ? 'estado-disponible' : 'estado-agotado';
        const estadoTexto = disponible ? 'DISPONIBLE' : 'AGOTADO';
        const nuevo = esNuevo(p.fechaAgregado);
        
        let badgesHTML = '';
        if (nuevo) badgesHTML += '<span class="badge badge-new">NEW</span>';
        if (p.oferta) {
            if (p.descuento) {
                badgesHTML += `<span class="badge badge-off">-${p.descuento}%</span>`;
            } else if (p.etiquetaOferta) {
                badgesHTML += `<span class="badge badge-off">${p.etiquetaOferta}</span>`;
            } else {
                badgesHTML += '<span class="badge badge-off">OFERTA</span>';
            }
        }
        
        const propiedadesFijas = ['nombre', 'precio', 'imagen', 'categorias', 'disponible', 'fechaAgregado', 'oferta', 'descuento', 'etiquetaOferta', 'color', 'colores'];
        const detallesArray = [];
        for (const [key, value] of Object.entries(p)) {
            if (!propiedadesFijas.includes(key) && value) {
                const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                detallesArray.push({ label, valor: value });
            }
        }
        
        const detallesHTML = detallesArray.map(d => `
            <div class="especificacion-item">
                <span class="especificacion-label">${d.label}</span>
                <span class="especificacion-valor">${d.valor}</span>
            </div>
        `).join('');
        
        const nombreId = p.nombre.replace(/[^a-zA-Z0-9]/g, '_');
        
        let selectorHTML = '';
        if (p.colores.length > 1) {
            const opciones = p.colores.map((color, idx) => {
                const colorLower = color.toLowerCase();
                const bgColor = colorMap[colorLower] || '#ccc';
                return `
                    <div class="color-opcion ${idx === 0 ? 'seleccionado' : ''}" data-color="${color}" onclick="seleccionarColor(this, '${p.nombre}')">
                        <span class="color-circulo" style="background-color: ${bgColor};"></span>
                        <span class="color-nombre">${color}</span>
                    </div>
                `;
            }).join('');
            selectorHTML = `
                <div class="producto-color-selector" id="selector-${nombreId}">
                    <span class="producto-color-label">COLOR:</span>
                    <div class="color-opciones">
                        ${opciones}
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="producto-card" data-nombre="${p.nombre}">
                <div class="producto-imagen-wrapper">
                    <img src="${p.imagen}" alt="${p.nombre}" class="producto-imagen" onerror="this.src='${IMAGEN_DEFAULT}'">
                    <div class="producto-badges">
                        ${badgesHTML}
                    </div>
                </div>
                
                <div class="producto-info">
                    <h3 class="producto-nombre">${p.nombre}</h3>
                    
                    ${selectorHTML}
                    
                    <button class="btn-detalles" data-nombre="${p.nombre}">
                        <span class="btn-detalles-texto">VER DETALLES</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    
                    <div class="producto-especificaciones oculto" id="detalles-${nombreId}">
                        ${detallesHTML}
                    </div>
                    
                    <div class="producto-precio">
                        <small>USD</small> $${p.precio}
                        ${p.oferta && p.descuento ? `<span class="descuento-badge">-${p.descuento}%</span>` : ''}
                    </div>
                    
                    <div class="producto-estado ${estadoClass}">${estadoTexto}</div>
                    
                    ${disponible ? 
                        `<button class="btn-agregar" onclick="agregarProducto('${p.nombre}')">AGREGAR</button>` : 
                        `<button class="btn-agotado" disabled>⛔ AGOTADO</button>`
                    }
                </div>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.btn-detalles').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const nombre = btn.dataset.nombre;
            const nombreId = nombre.replace(/[^a-zA-Z0-9]/g, '_');
            const detalles = document.getElementById(`detalles-${nombreId}`);
            const icon = btn.querySelector('i');
            const texto = btn.querySelector('.btn-detalles-texto');
            
            detalles.classList.toggle('oculto');
            if (detalles.classList.contains('oculto')) {
                icon.style.transform = 'rotate(0deg)';
                texto.textContent = 'VER DETALLES';
            } else {
                icon.style.transform = 'rotate(180deg)';
                texto.textContent = 'OCULTAR DETALLES';
            }
        });
    });
}

function seleccionarColor(elemento, nombreProducto) {
    const padre = elemento.parentNode;
    Array.from(padre.children).forEach(child => child.classList.remove('seleccionado'));
    elemento.classList.add('seleccionado');
}

function agregarProducto(nombre) {
    const producto = productosData.productos.find(p => p.nombre === nombre);
    if (!producto || !producto.disponible) return;
    
    let colorSeleccionado = '';
    const nombreId = nombre.replace(/[^a-zA-Z0-9]/g, '_');
    
    if (producto.colores.length > 1) {
        const selector = document.querySelector(`#selector-${nombreId} .color-opcion.seleccionado`);
        if (!selector) {
            mostrarNotificacion('Por favor selecciona un color');
            return;
        }
        colorSeleccionado = selector.dataset.color;
    }
    
    const existente = carrito.find(item => item.nombre === nombre && item.color === colorSeleccionado);
    
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
            imagen: producto.imagen,
            color: colorSeleccionado
        });
    }
    
    guardarCarrito();
    actualizarContadorCarrito();
    
    const btn = event.target;
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = 'scale(1)', 200);
}

function eliminarDelCarrito(nombre, color) {
    carrito = carrito.filter(item => !(item.nombre === nombre && item.color === color));
    guardarCarrito();
    actualizarContadorCarrito();
    abrirCarrito();
}

function actualizarCantidad(nombre, color, nuevaCantidad) {
    if (nuevaCantidad < 1) {
        eliminarDelCarrito(nombre, color);
        return;
    }
    const item = carrito.find(item => item.nombre === nombre && item.color === color);
    if (item) {
        item.cantidad = nuevaCantidad;
        guardarCarrito();
        abrirCarrito();
    }
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarContadorCarrito();
    abrirCarrito();
}

function guardarCarrito() {
    localStorage.setItem('luxuriaCarrito', JSON.stringify(carrito));
}

function actualizarContadorCarrito() {
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contadorCarrito.textContent = total;
}

function calcularTotales() {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    return { subtotal, total: subtotal };
}

function abrirCarrito() {
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p style="text-align:center; padding:2rem; color:#888;">Tu carrito está vacío</p>';
    } else {
        carritoItems.innerHTML = carrito.map(item => {
            const producto = productosData.productos.find(p => p.nombre === item.nombre);
            const imagenSrc = producto ? producto.imagen : item.imagen || IMAGEN_DEFAULT;
            const colorLower = item.color ? item.color.toLowerCase() : '';
            const bgColor = colorMap[colorLower] || '#ccc';
            
            return `
                <div class="carrito-item-simple">
                    <div class="carrito-item-imagen">
                        <img src="${imagenSrc}" alt="${item.nombre}" onerror="this.src='${IMAGEN_DEFAULT}'">
                    </div>
                    <div class="carrito-item-detalles">
                        <div class="carrito-item-nombre-truncado" title="${item.nombre}">${item.nombre}</div>
                        ${item.color ? `
                            <div class="carrito-item-color">
                                <span class="color-circulo" style="background-color: ${bgColor};"></span>
                                <span>${item.color}</span>
                            </div>
                        ` : ''}
                        <div class="carrito-item-precio">$${item.precio.toFixed(2)}</div>
                    </div>
                    <div class="carrito-item-acciones">
                        <div class="carrito-item-cantidad">
                            <button onclick="actualizarCantidad('${item.nombre}', '${item.color}', ${item.cantidad - 1})">−</button>
                            <span>${item.cantidad}</span>
                            <button onclick="actualizarCantidad('${item.nombre}', '${item.color}', ${item.cantidad + 1})">+</button>
                        </div>
                        <button class="btn-eliminar-item" onclick="eliminarDelCarrito('${item.nombre}', '${item.color}')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        }).join('');
    }
    carritoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarCarritoModal() {
    carritoModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function abrirResumenCompra() {
    if (carrito.length === 0) {
        mostrarNotificacion('Tu carrito está vacío');
        return;
    }
    const miniaturasHTML = carrito.map(item => {
        const producto = productosData.productos.find(p => p.nombre === item.nombre);
        const imagenSrc = producto ? producto.imagen : item.imagen || IMAGEN_DEFAULT;
        return `
            <div class="miniatura-precio-item">
                <div class="miniatura-resumen">
                    <img src="${imagenSrc}" alt="${item.nombre}" onerror="this.src='${IMAGEN_DEFAULT}'">
                </div>
                <span class="precio-miniatura">$${item.precio.toFixed(2)}</span>
            </div>
        `;
    }).join('');
    resumenProductos.innerHTML = miniaturasHTML;
    const { subtotal, total } = calcularTotales();
    resumenSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    resumenTotal.textContent = `$${total.toFixed(2)}`;
    cerrarCarritoModal();
    resumenModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function verProducto(nombre, color) {
    cerrarCarritoModal();
    const producto = productosData.productos.find(p => p.nombre === nombre);
    if (!producto) return;
    const tarjeta = document.querySelector(`.producto-card[data-nombre="${nombre}"]`);
    if (tarjeta) {
        tarjeta.scrollIntoView({ behavior: 'smooth', block: 'center' });
        tarjeta.style.transition = 'box-shadow 0.3s';
        tarjeta.style.boxShadow = '0 0 0 3px var(--dorado)';
        setTimeout(() => {
            tarjeta.style.boxShadow = '';
        }, 1500);
        if (color) {
            const nombreId = nombre.replace(/[^a-zA-Z0-9]/g, '_');
            const opciones = document.querySelectorAll(`#selector-${nombreId} .color-opcion`);
            opciones.forEach(opt => {
                if (opt.dataset.color === color) {
                    opt.classList.add('seleccionado');
                } else {
                    opt.classList.remove('seleccionado');
                }
            });
        }
        const btnDetalles = tarjeta.querySelector('.btn-detalles');
        const detalles = tarjeta.querySelector('.producto-especificaciones');
        if (btnDetalles && detalles && detalles.classList.contains('oculto')) {
            btnDetalles.click();
        }
    }
}

function cerrarModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function abrirPerfil() {
    if (!usuario) {
        registroModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
    }
    document.getElementById('perfilNombre').value = usuario.nombre || '';
    document.getElementById('perfilTelefono').value = usuario.telefono || '';
    document.getElementById('perfilProvincia').value = usuario.provincia || '';
    document.getElementById('perfilMunicipio').value = usuario.municipio || '';
    document.getElementById('perfilZona').value = usuario.zona || '';
    document.getElementById('perfilDireccion').value = usuario.direccion || '';
    document.getElementById('perfilNumero').value = usuario.numero || '';
    perfilModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function guardarPerfil(e) {
    e.preventDefault();
    const nuevoNombre = document.getElementById('perfilNombre').value;
    const nuevoTelefono = document.getElementById('perfilTelefono').value;
    const nuevaProvincia = document.getElementById('perfilProvincia').value;
    const nuevoMunicipio = document.getElementById('perfilMunicipio').value;
    const nuevaZona = document.getElementById('perfilZona').value;
    const nuevaDireccion = document.getElementById('perfilDireccion').value;
    const nuevoNumero = document.getElementById('perfilNumero').value;
    usuario = {
        ...usuario,
        nombre: nuevoNombre,
        telefono: nuevoTelefono,
        provincia: nuevaProvincia,
        municipio: nuevoMunicipio,
        zona: nuevaZona,
        direccion: nuevaDireccion,
        numero: nuevoNumero,
        fecha: new Date().toISOString()
    };
    localStorage.setItem('luxuriaUsuario', JSON.stringify(usuario));
    cerrarModal(perfilModal);
    if (enFlujoCompra) {
        mostrarRevisionDatos();
    } else {
        mostrarNotificacion('Datos actualizados correctamente');
    }
}

function procesarPedido() {
    if (carrito.length === 0) {
        mostrarNotificacion('Tu carrito está vacío');
        return;
    }
    cerrarModal(resumenModal);
    if (!usuario) {
        registroModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        mostrarRevisionDatos();
    }
}

function mostrarRevisionDatos() {
    if (!usuario) return;
    revNombre.textContent = usuario.nombre || '';
    revTelefono.textContent = usuario.telefono || '';
    revProvincia.textContent = usuario.provincia || '';
    revMunicipio.textContent = usuario.municipio || '';
    revZona.textContent = usuario.zona || '';
    revDireccion.textContent = usuario.direccion || '';
    revNumero.textContent = usuario.numero || '';
    enFlujoCompra = true;
    revisionModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function guardarRegistro(e) {
    e.preventDefault();
    const nuevoNombre = document.getElementById('regNombre').value;
    const nuevoTelefono = document.getElementById('regTelefono').value;
    const nuevaProvincia = document.getElementById('regProvincia').value;
    const nuevoMunicipio = document.getElementById('regMunicipio').value;
    const nuevaZona = document.getElementById('regZona').value;
    const nuevaDireccion = document.getElementById('regDireccion').value;
    const nuevoNumero = document.getElementById('regNumero').value;
    usuario = {
        nombre: nuevoNombre,
        telefono: nuevoTelefono,
        provincia: nuevaProvincia,
        municipio: nuevoMunicipio,
        zona: nuevaZona,
        direccion: nuevaDireccion,
        numero: nuevoNumero,
        fecha: new Date().toISOString()
    };
    localStorage.setItem('luxuriaUsuario', JSON.stringify(usuario));
    cerrarModal(registroModal);
    enviarPedidoWhatsApp();
}

// ===== ENVÍO A WHATSAPP (VERSIÓN FINAL) =====
function enviarPedidoWhatsApp() {
    console.log("🔵 INICIANDO ENVÍO A WHATSAPP");
    
    if (!carrito || carrito.length === 0) {
        console.error("❌ Carrito vacío");
        mostrarNotificacion("Error: No hay productos");
        return;
    }
    if (!usuario) {
        console.error("❌ Usuario no definido");
        mostrarNotificacion("Error: Datos de usuario");
        return;
    }

    const { total } = calcularTotales();
    const numPedido = generarNumeroPedido();
    const tiendaUrl = "https://gammyg9g.github.io/lujuriasexshop";

    // Construir dirección completa
    const partesDireccion = [];
    if (usuario.provincia && usuario.provincia.trim() !== '') partesDireccion.push(usuario.provincia);
    if (usuario.municipio && usuario.municipio.trim() !== '') partesDireccion.push(usuario.municipio);
    if (usuario.zona && usuario.zona.trim() !== '') partesDireccion.push(usuario.zona);
    if (usuario.direccion && usuario.direccion.trim() !== '') {
        let dir = usuario.direccion;
        if (usuario.numero && usuario.numero.trim() !== '') {
            dir += ` #${usuario.numero}`;
        }
        partesDireccion.push(dir);
    }
    const direccionCompleta = partesDireccion.join(', ');

    // Construir mensaje
    let mensaje = `*${TIENDA_NOMBRE} - NUEVO PEDIDO*\n\n`;
    mensaje += `*Cliente:* ${usuario.nombre || ''}\n`;
    mensaje += `*Teléfono:* ${usuario.telefono || ''}\n`;
    mensaje += `*Dirección:* ${direccionCompleta}\n`;
    mensaje += `*Pedido:* ${numPedido}\n\n`;
    mensaje += `*PRODUCTOS*\n`;

    carrito.forEach(item => {
        let linea = `• ${item.nombre}`;
        if (item.color) linea += ` (${item.color})`;
        linea += ` x${item.cantidad} = $${(item.precio * item.cantidad).toFixed(2)}`;
        mensaje += linea + '\n';
    });

    mensaje += `\n*TOTAL: $${total.toFixed(2)}*\n\n`;
    mensaje += `Tienda: ${tiendaUrl}`;

    console.log("📨 Mensaje completo:\n", mensaje);

    // Codificar para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeCodificado}`;
    
    // Abrir WhatsApp
    window.open(url, '_blank');

    // Actualizar UI
    numeroPedido.textContent = `#${numPedido}`;
    totalConfirmacion.textContent = `Total: $${total.toFixed(2)}`;
    confirmacionModal.classList.add('active');

    carrito = [];
    guardarCarrito();
    actualizarContadorCarrito();
}

function generarNumeroPedido() {
    const f = new Date();
    return `LUX-${f.getFullYear()}${String(f.getMonth()+1).padStart(2,'0')}${String(f.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`;
}

function copiarTexto(texto) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto)
            .then(() => mostrarNotificacion('¡Número copiado!'))
            .catch(() => copiarTextoFallback(texto));
    } else {
        copiarTextoFallback(texto);
    }
}

function copiarTextoFallback(texto) {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    try {
        document.execCommand('copy');
        mostrarNotificacion('¡Número copiado!');
    } catch (err) {
        mostrarNotificacion('No se pudo copiar');
    }
    document.body.removeChild(textarea);
}

window.agregarProducto = agregarProducto;
window.seleccionarColor = seleccionarColor;
window.eliminarDelCarrito = eliminarDelCarrito;
window.actualizarCantidad = actualizarCantidad;
window.vaciarCarrito = vaciarCarrito;
window.verProducto = verProducto;
