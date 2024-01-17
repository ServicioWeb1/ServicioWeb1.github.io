document.addEventListener('DOMContentLoaded', function() {
    var productos = [
        { id: 1, nombre: 'Producto 1', cantidad: 5, precio: 10.99 },
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
    var totalProductosCell = document.getElementById('totalProductos');

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
                '<td class="editable" data-id="' + producto.id + '" data-prop="nombre">' +
                '<input type="text" class="form-control" value="' + producto.nombre + '" />' +
                '</td>' +
                '<td class="editable" data-id="' + producto.id + '" data-prop="cantidad">' +
                '<input type="text" class="form-control" value="' + formatearConComas(producto.cantidad) + '" />' +
                '</td>' +
                '<td class="editable" data-id="' + producto.id + '" data-prop="precio">' +
                '<input type="text" class="form-control" value="' + formatearConComas(producto.precio.toFixed(2)) + '" />' +
                '</td>' +
                '<td>' + formatearConComas(total.toFixed(2)) + '</td>' +
                '<td><button class="btn btn-danger eliminar" data-id="' + producto.id + '">Eliminar</button></td>' +
                '</tr>';
            tbody.innerHTML += fila;
        });

        agregarEventosEditable();
        agregarEventosEliminar();
 	agregarTotalProductos();
    }

    function formatearConComas(valor) {
        return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function generarIdFactura() {
        // Simple function to generate a unique invoice ID
        return 'INV-' + Math.floor(Math.random() * 10000);
    }

   function agregarTotalProductos() {
        var total = productos.reduce(function(sum, producto) {
            return sum + producto.cantidad * producto.precio;
        }, 0);

        totalProductosCell.textContent = 'Total: ' + formatearConComas(total.toFixed(2));
    }

    function agregarEventosEditable() {
        var celdasEditables = document.querySelectorAll('.editable input');

        celdasEditables.forEach(function(input) {
            input.addEventListener('change', function() {
                var idProducto = parseInt(input.parentElement.dataset.id);
                var propiedad = input.parentElement.dataset.prop;

                var nuevoValor = (propiedad === 'cantidad' || propiedad === 'precio') ? parseFloat(input.value.replace(',', '')) : input.value;

                var producto = productos.find(function(p) {
                    return p.id === idProducto;
                });

                if (producto) {
                    producto[propiedad] = nuevoValor;
                    cargarProductos();
                }
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

 // Add a button to trigger the invoice printing
    var imprimirFacturaBtn = document.getElementById('imprimirFactura');
    imprimirFacturaBtn.addEventListener('click', imprimirFactura);


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

    function agregarNuevoProducto() {
        var nuevoId = productos.length + 1;
        var nuevoProducto = {
            id: nuevoId,
            nombre: '',
            cantidad: 0,
            precio: 0.00
        };
        productos.push(nuevoProducto);
        cargarProductos();

        // Automatically focus on the first input in the newly added row
        var nuevaFila = tablaProductos.querySelector('tbody tr:last-child');
        if (nuevaFila) {
            var firstInput = nuevaFila.querySelector('.editable input');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }

    agregarProductoBtn.addEventListener('click', agregarNuevoProducto);

    cargarProductos();
});
