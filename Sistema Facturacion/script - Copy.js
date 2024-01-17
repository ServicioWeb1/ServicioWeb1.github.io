document.addEventListener('DOMContentLoaded', function() {
    var productos = [
        { id: 1, nombre: 'Producto 1', cantidad: 5, precio: 10.99 },
        { id: 2, nombre: 'Producto 2', cantidad: 3, precio: 5.99 },
        // Add more products as needed
    ];

    var cliente = {
  	idFactura: generarIdFactura(),
        nombre: '',
        direccion: '',
        telefono: '',
        email: ''
    };

    var tablaProductos = document.getElementById('tablaProductos');
    var agregarProductoBtn = document.getElementById('agregarProducto');

    var nombreClienteInput = document.getElementById('nombreCliente');
    var direccionClienteInput = document.getElementById('direccionCliente');
    var telefonoClienteInput = document.getElementById('telefonoCliente');
    var emailClienteInput = document.getElementById('emailCliente');

    function cargarProductos() {
        var tbody = tablaProductos.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';

        productos.forEach(function(producto) {
            var total = producto.cantidad * producto.precio;

            var fila = '<tr>' +
                        '<td>' + producto.id + '</td>' +
                        '<td class="editable" data-id="' + producto.id + '" data-prop="nombre">' + producto.nombre + '</td>' +
                        '<td class="editable" data-id="' + producto.id + '" data-prop="cantidad">' + formatearConComas(producto.cantidad) + '</td>' +
                        '<td class="editable" data-id="' + producto.id + '" data-prop="precio">' + formatearConComas(producto.precio.toFixed(2)) + '</td>' +
                        '<td>' + formatearConComas(total.toFixed(2)) + '</td>' +
                        '<td><button class="btn btn-danger eliminar" data-id="' + producto.id + '">Eliminar</button></td>' +
                        '</tr>';
            tbody.innerHTML += fila;
        });

        agregarEventosEditable();
        agregarEventosEliminar();
    }

    function formatearConComas(valor) {
        return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function generarIdFactura() {
        // Simple function to generate a unique invoice ID
        return 'INV-' + Math.floor(Math.random() * 10000);
    }

    function agregarEventosEditable() {
        var celdasEditables = document.getElementsByClassName('editable');

        Array.from(celdasEditables).forEach(function(celda) {
            celda.addEventListener('click', function() {
                var idProducto = parseInt(celda.dataset.id);
                var propiedad = celda.dataset.prop;

                var nuevoValor = prompt('Ingrese el nuevo valor para ' + propiedad);
                nuevoValor = (propiedad === 'cantidad' || propiedad === 'precio') ? parseFloat(nuevoValor) : nuevoValor;

                if (nuevoValor !== null && !isNaN(nuevoValor)) {
                    var producto = productos.find(function(p) {
                        return p.id === idProducto;
                    });

                    if (producto) {
                        producto[propiedad] = nuevoValor;
                        cargarProductos();
                    }
                }
            });
        });
    }

    function agregarEventosEliminar() {
        var botonesEliminar = document.getElementsByClassName('eliminar');

        Array.from(botonesEliminar).forEach(function(boton) {
            boton.addEventListener('click', function() {
                var idProducto = parseInt(boton.dataset.id);

                productos = productos.filter(function(producto) {
                    return producto.id !== idProducto;
                });

                cargarProductos();
            });
        });
    }


  function imprimirFactura() {

	cliente.nombre = nombreClienteInput.value;
        cliente.direccion = direccionClienteInput.value;
        cliente.telefono = telefonoClienteInput.value;
        cliente.email = emailClienteInput.value;


 var productosArray = productos.map(function(producto) {
                return {
                    id: producto.id,
                    nombre: producto.nombre,
                    cantidad: producto.cantidad,
                    precio: producto.precio
                };
            });

      var queryString = '?idFactura=' + cliente.idFactura +
                          '&nombre=' + encodeURIComponent(cliente.nombre) +
                          '&direccion=' + encodeURIComponent(cliente.direccion) +
                          '&telefono=' + encodeURIComponent(cliente.telefono) +
                          '&email=' + encodeURIComponent(cliente.email)+
			  '&productos=' + encodeURIComponent(JSON.stringify(productosArray));

        // Open invoice.html with the query string
        window.open('invoice.html' + queryString, '_blank');
    }

    function generarFacturaHTML() {
          var facturaHTML = '<h2>Factura</h2>';
	 facturaHTML += '<p>Factura No: ' + cliente.idFactura + '</p>';
        facturaHTML += '<h3>Información del Cliente</h3>';
        facturaHTML += '<p>Nombre: ' + cliente.nombre + '</p>';
        facturaHTML += '<p>Dirección: ' + cliente.direccion + '</p>';
        facturaHTML += '<p>Teléfono: ' + cliente.telefono + '</p>';
        facturaHTML += '<p>Email: ' + cliente.email + '</p>';
        facturaHTML += '<h3>Productos</h3>';
        facturaHTML += '<table border="1">';
        facturaHTML += '<tr><th>ID</th><th>Nombre</th><th>Cantidad</th><th>Precio Unitario</th><th>Total</th></tr>';

        productos.forEach(function(producto) {
            var total = producto.cantidad * producto.precio;

            facturaHTML += '<tr>';
            facturaHTML += '<td>' + producto.id + '</td>';
            facturaHTML += '<td>' + producto.nombre + '</td>';
            facturaHTML += '<td>' + formatearConComas(producto.cantidad) + '</td>';
            facturaHTML += '<td>' + formatearConComas(producto.precio.toFixed(2)) + '</td>';
            facturaHTML += '<td>' + formatearConComas(total.toFixed(2)) + '</td>';
            facturaHTML += '</tr>';
        });

        facturaHTML += '</table>';

        return facturaHTML;
    }

    // Add a button to trigger the invoice printing
    var imprimirFacturaBtn = document.getElementById('imprimirFactura');
    imprimirFacturaBtn.addEventListener('click', imprimirFactura);


    agregarProductoBtn.addEventListener('click', function() {
        var nuevoId = productos.length + 1;
        var nuevoProducto = {
            id: nuevoId,
            nombre: 'Nuevo Producto ' + nuevoId,
            cantidad: 0,
            precio: 0.00
        };
        productos.push(nuevoProducto);
        cargarProductos();

        // Automatically trigger inline edit on the newly added row
        var nuevaFila = tablaProductos.querySelector('tbody tr:last-child');
        if (nuevaFila) {
            Array.from(nuevaFila.getElementsByClassName('editable')).forEach(function(celda) {
                celda.click();
            });
        }
    });

    cargarProductos();
});
