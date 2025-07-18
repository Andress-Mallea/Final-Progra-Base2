import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
import { HttpClientModule } from '@angular/common/http'; // Mantenerlo por si se usa en el futuro, aunque los servicios son mock
import { forkJoin, Observable } from 'rxjs'; // Import forkJoin and Observable
import { map } from 'rxjs/operators'; // Import map
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Import HttpClient y HttpErrorResponse

// Importa las interfaces de los modelos
import { Producto } from './models/producto.model';
import { Usuario } from './models/usuario.model';
import { Cliente } from './models/cliente.model';
import { Empleado } from './models/empleado.model';
import { Tienda } from './models/tienda.model';
import { RolDeUsuario } from './models/rol-de-usuario.model';
import { UsuarioRol } from './models/usuario-rol.model';
import { CategoriaProducto } from './models/categoria-producto.model';
import { DetalleDePedido } from './models/detalle-de-pedido.model';
import { EstadoPedido } from './models/estado-pedido.model';
import { Factura } from './models/factura.model';
import { Pago } from './models/pago.model';
import { PagosDetallePedido } from './models/pagos-detalle-pedido.model';
import { Pedido } from './models/pedido.model';


// Importa los servicios (mockeados)
import { ProductoService } from './Tablas/producto.service';
import { UsuarioService } from './Tablas/usuario.service';
import { ClienteService } from './Tablas/cliente.service';
import { EmpleadoService } from './Tablas/empleado.service';
import { TiendaService } from './Tablas/tienda.service';
import { RolDeUsuarioService } from './Tablas/rol-de-usuario.service';
import { UsuarioRolService } from './Tablas/usuario-rol.service';
import { CategoriaProductoService } from './Tablas/categoria-producto.service';
import { DetalleDePedidoService } from './Tablas/detalle-de-pedido.service';
import { EstadoPedidoService } from './Tablas/estado-pedido.service';
import { FacturaService } from './Tablas/factura.service';
import { PagoService } from './Tablas/pago.service';
import { PagosDetallePedidoService } from './Tablas/pagos-detalle-pedido.service';
import { PedidoService } from './Tablas/pedido.service';


// Definimos los tipos de roles para mayor claridad y seguridad de tipo
export type UserRole = 'Cliente' | 'Empleado' | 'Vendedor' | 'Administrador' | 'Repartidor';

export type LoggedInUser = Usuario & Partial<Cliente> & Partial<Empleado> & Partial<Tienda> & { userType: UserRole };


@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, HttpClientModule], // Agrega HttpClientModule aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  products: Producto[] = [];
  tiendas: Tienda[] = []; // Nueva propiedad para almacenar las tiendas
  selectedStore: Tienda | null = null; // Nueva propiedad para la tienda seleccionada
  storeProducts: Producto[] = []; // Nueva propiedad para productos de la tienda seleccionada

  cartItems: Producto[] = [];
  showShoppingCartMenu: boolean = false;
  currentActiveLink: string = 'Inicio'; // Por defecto, se inicia en la vista de tiendas
  showSellMenu: boolean = false;
  showProductDetailMenu: boolean = false;
  selectedProduct: Producto | null = null;
  showPaymentMenu: boolean = false;
  paymentMethod: string = '';

  // Propiedades para los datos de la tarjeta
  cardNumber: string = '';
  cardName: string = '';
  cardExpiry: string = '';
  cardCVC: string = '';

  // Propiedades para el formulario de venta
  newProductName: string = '';
  newProductDescription: string = '';
  newProductPrice: number | null = null;
  newProductImage: string = '';
  newProductStock: number = 1;

  // Propiedades para el formulario de Login
  showLoginMenu: boolean = false;
  loginEmail: string = '';
  loginPassword: string = '';

  // Propiedades para el formulario de Registro
  showRegisterMenu: boolean = false;
  registerNombre: string = '';
  registerApellido: string = '';
  registerEmail: string = '';
  registerTelefono: string = '';
  registerPassword: string = '';
  registerConfirmPassword: string = '';
  registerUserType: UserRole = 'Cliente'; // Default user type for registration

  // Propiedades condicionales para el registro (Cliente)
  registerDireccion: string = '';
  registerCiudad: string = '';
  registerCodigoPostal: string = '';

  // Propiedades condicionales para el registro (Empleado)
  registerFechaContratacion: string = '';
  registerRolInterno: string = '';
  registerSalario: number | null = null;

  // Propiedades condicionales para el registro (Tienda/Vendedor)
  registerNombreTienda: string = '';
  registerCuentaBanco: string = '';

  // Nuevas propiedades para el menú de usuario
  loggedInUser: LoggedInUser | null = null;
  sellingProducts: Producto[] = []; // Productos que el usuario está vendiendo (simulado)
  purchasedProducts: Producto[] = []; // Productos que el usuario ha comprado (simulado)

  // Nueva propiedad para el menú de convertir a vendedor
  showConvertToSellerMenu: boolean = false;
  convertToSellerNombreTienda: string = '';
  convertToSellerCuentaBanco: string = '';

  // Propiedades para el historial de pedidos del cliente
  showOrderHistoryMenu: boolean = false;
  customerOrders: Pedido[] = [];
  selectedOrder: Pedido | null = null;
  selectedOrderDetails: { product: Producto, detail: DetalleDePedido }[] = [];
  selectedOrderPayment: Pago | null = null;
  selectedOrderFactura: Factura | null = null;
  selectedOrderEstado: EstadoPedido | null = null; // Para guardar el estado del pedido

  // Nueva propiedad para controlar la visibilidad del menú de productos
  showProductsMenu: boolean = false;
  registrationMessage: string = '';

  constructor(
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private empleadoService: EmpleadoService,
    private tiendaService: TiendaService,
    private rolDeUsuarioService: RolDeUsuarioService,
    private usuarioRolService: UsuarioRolService,
    private categoriaProductoService: CategoriaProductoService,
    private detalleDePedidoService: DetalleDePedidoService,
    private estadoPedidoService: EstadoPedidoService,
    private facturaService: FacturaService,
    private pagoService: PagoService,
    private pagosDetallePedidoService: PagosDetallePedidoService,
    private pedidoService: PedidoService,
    private http: HttpClient // <-- Add this line to inject HttpClient
  ) { }


  ngOnInit(): void {
    this.loadProducts(); // Carga todos los productos
    this.loadTiendas(); // Carga todas las tiendas para la vista de inicio
  }

  // Cambia loadProducts para obtener productos del backend y usar los nombres correctos
  loadProducts(): void {
    this.productoService.getProductos().subscribe(
      (data: Producto[]) => {
        this.products = data;
        console.log('Productos cargados (desde backend):', this.products);
      },
      (error: any) => {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar productos desde el backend.');
      }
    );
  }

  // Nuevo método: Cargar todas las tiendas
  loadTiendas(): void {
  this.tiendaService.getTiendas().subscribe(
    (data: Tienda[]) => {
      this.tiendas = data;
      console.log('Tiendas cargadas:', this.tiendas);
    },
    (error: any) => {
      console.error('Error al cargar tiendas:', error);
    }
  );
}

  // Nuevo método: Ver productos de una tienda específica

  viewStoreProducts(tienda: Tienda): void {
    this.selectedStore = tienda;
    // Filtra los productos que pertenecen a esta tienda por su VendedorID
     this.storeProducts = this.products.filter(
    product => product.vendedorID === tienda.vendedorID
  );
  console.log('Productos filtrados:', this.storeProducts);
  this.currentActiveLink = 'StoreDetail'; // Nuevo estado para la vista de detalles de tienda
    this.showShoppingCartMenu = false;
    this.showSellMenu = false;
    this.showProductDetailMenu = false;
    this.showPaymentMenu = false;
    this.showLoginMenu = false;
    this.showRegisterMenu = false;
    this.showConvertToSellerMenu = false; // Asegurarse de ocultar el menú de conversión
    this.showOrderHistoryMenu = false; // Asegurarse de ocultar el historial de pedidos
    this.showProductsMenu = false; // Ocultar el menú general de productos
    console.log('Viendo productos de la tienda:', tienda.nombreDeTienda);
  }

  // Nuevo método: Volver a la lista de tiendas
  backToStoreList(): void {
    this.selectedStore = null;
    this.currentActiveLink = 'Inicio'; // Vuelve a la vista de inicio (lista de tiendas)
  }

  addToCart(product: Producto): void {
    this.cartItems.push(product);
    console.log('Producto añadido al carrito:', product);
  }

  removeFromCart(productToRemove: Producto): void {
    const index = this.cartItems.findIndex(product => product.productoID === productToRemove.productoID);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      console.log('Producto eliminado del carrito:', productToRemove);
    }
  }

  getTotalCartAmount(): number {
    // Se añade una verificación para asegurar que item.Precio no sea undefined/null
    return this.cartItems.reduce((total, item) => total + (item.precio || 0), 0);
  }

  toggleShoppingCartMenu(): void {
    if (this.currentActiveLink === 'Carrito') {
      this.showShoppingCartMenu = false;
      this.currentActiveLink = 'Inicio';
    } else {
      this.showShoppingCartMenu = true;
      this.currentActiveLink = 'Carrito';
      this.showSellMenu = false;
      this.showProductDetailMenu = false;
      this.showPaymentMenu = false;
      this.showLoginMenu = false;
      this.showRegisterMenu = false;
      this.showConvertToSellerMenu = false; // Asegurarse de ocultar el menú de conversión
      this.showOrderHistoryMenu = false; // Asegurarse de ocultar el historial de pedidos
      this.showProductsMenu = false; // Ocultar el menú general de productos
      // Asegurarse de que la vista de la tienda no esté activa si se va al carrito
      this.selectedStore = null;
    }
  }

  viewProductDetail(product: Producto): void {
    this.selectedProduct = product;
    this.currentActiveLink = 'ProductDetail';
    this.showProductDetailMenu = true;
    this.showShoppingCartMenu = false;
    this.showSellMenu = false;
    this.showPaymentMenu = false;
    this.showLoginMenu = false;
    this.showRegisterMenu = false;
    this.showConvertToSellerMenu = false; // Asegurarse de ocultar el menú de conversión
    this.showOrderHistoryMenu = false; // Asegurarse de ocultar el historial de pedidos
    this.showProductsMenu = false; // Ocultar el menú general de productos
    // Asegurarse de que la vista de la tienda no esté activa
    this.selectedStore = null;
    console.log('Viendo detalles de:', product.nombre);
  }

  setActiveLink(linkName: string): void {
    this.currentActiveLink = linkName;

    // Reiniciar visibilidad de todos los menús a false
    this.showShoppingCartMenu = false;
    this.showSellMenu = false;
    this.showProductDetailMenu = false;
    this.showPaymentMenu = false;
    this.showLoginMenu = false;
    this.showRegisterMenu = false;
    this.showConvertToSellerMenu = false; // Reiniciar también el menú de conversión
    this.showOrderHistoryMenu = false; // Reiniciar el menú de historial de pedidos
    this.showProductsMenu = false; // Reiniciar el menú de productos

    // Resetea selectedStore si el usuario no está en una vista de tienda específica
    if (linkName === 'Inicio') { // Solo 'Inicio' restablece la tienda seleccionada
      this.selectedStore = null;
    }

    switch (linkName) {
      case 'Carrito':
        this.showShoppingCartMenu = true;
        break;
      case 'Vender':
        // Si NO hay usuario logueado o NO es vendedor, redirige a login y muestra alerta
  if (!this.loggedInUser || this.loggedInUser.userType !== 'Vendedor') {
    alert('Debes ser Vendedor para poder vender. Por favor, inicia sesión o regístrate como vendedor.');
    this.showLoginMenu = true;
    this.currentActiveLink = 'Iniciar Sesion';
  } else {
    // Si es vendedor, muestra el formulario de venta
    this.showSellMenu = true;
  }
        break;
      case 'Iniciar Sesion':
        this.showLoginMenu = true;
        break;
      case 'Registrarse':
        this.showRegisterMenu = true;
        break;
      case 'Mi Cuenta':
        this.currentActiveLink = 'Mi Cuenta';
        break;
      case 'HistorialPedidos': // Nuevo caso para el historial de pedidos
        if (this.loggedInUser && this.loggedInUser.userType === 'Cliente') {
          this.viewOrderHistory();
        } else {
          alert('Debes iniciar sesión como cliente para ver el historial de pedidos.');
          this.setActiveLink('Mi Cuenta'); // O redirigir a login/perfil
        }
        break;
      case 'Productos': // Caso explícito para el botón de Productos
        this.showProductsMenu = true;
        break;
    }
  }

  // Método para simular la subida de un producto (con validación)
  uploadProduct(): void {
    if (!this.newProductName || !this.newProductDescription || this.newProductPrice === null || this.newProductPrice <= 0) {
      alert('Por favor, rellena todos los campos requeridos (Nombre, Descripción, Precio mayor a 0).');
      return;
    }

    if (!this.loggedInUser || this.loggedInUser.userType !== 'Vendedor') {
      alert('Solo los vendedores pueden subir productos. Por favor, convierte tu cuenta a vendedor.');
      return;
    }

    const sellerId = (this.loggedInUser as Tienda).UsuarioID;
    console.log('ID del vendedor:', sellerId);
    if (sellerId === undefined) {
      alert('No se pudo determinar el ID del vendedor para subir el producto.');
      return;
    }

    const newProduct: Producto = {
      productoID: this.products.length + 1, // El ID será asignado por el backend
      nombre: this.newProductName,
      descripcion: this.newProductDescription,
      precio: this.newProductPrice,
      imagen: this.newProductImage,
      vendedorID: sellerId,
      cantidad: this.newProductStock, // O el campo que corresponda en tu modelo
      activo: true,
      fechaCreacion: new Date()
    };

    this.productoService.addProducto(newProduct).subscribe(
      (addedProduct: Producto) => {
        this.products.push(addedProduct);
        if (this.loggedInUser && this.loggedInUser.userType === 'Vendedor') {
          this.sellingProducts = [...this.sellingProducts, addedProduct];
        }
        console.log('Producto subido:', addedProduct);
        alert('¡Producto "' + addedProduct.nombre + '" subido con éxito!');
        this.newProductName = '';
        this.newProductDescription = '';
        this.newProductPrice = null;
        this.newProductImage = '';
        this.setActiveLink('Productos');
      },
      (error: any) => {
        console.error('Error al subir producto:', error);
        alert('Hubo un error al subir el producto.' + error);
      }
    );
  }

  proceedToPayment(): void {
    this.showShoppingCartMenu = false;
    this.showPaymentMenu = true;
    this.paymentMethod = '';
    this.currentActiveLink = 'Payment';
    console.log('Procediendo al pago...');
  }

  selectPaymentMethod(method: string): void {
    this.paymentMethod = method;
    console.log('Método de pago seleccionado:', method);
  }

  processPayment(): void {
    if (this.paymentMethod === 'card') {
      if (!this.cardNumber || !this.cardName || !this.cardExpiry || !this.cardCVC) {
        alert('Por favor, rellena todos los datos de la tarjeta.');
        return;
      }
      const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
      if (!expiryRegex.test(this.cardExpiry)) {
        alert('Formato de fecha de vencimiento inválido. Utiliza MM/AA.');
        return;
      }
      console.log('Procesando pago con tarjeta...');
    } else if (this.paymentMethod === 'qr') {
      console.log('Procesando pago con QR...');
    } else {
      alert('Por favor, selecciona un método de pago.');
      return;
    }

    if (!this.loggedInUser || this.loggedInUser.userType !== 'Cliente') {
      alert('Debes iniciar sesión como cliente para realizar una compra.');
      return;
    }
    
    const clienteID = this.loggedInUser.UsuarioID;
    const tipoEntrega = 'Domicilio'; // O puedes permitir que el usuario elija el tipo de entrega

    let allPurchasesSuccessful = true;
    let errorMessage = '';

    // Utiliza un array para almacenar todas las observables de las compras
    const purchaseObservables: Observable<any>[] = [];

    this.cartItems.forEach(producto => {
        const compraRequest = {
            ClienteID: clienteID,
            ProductoID: producto.productoID,
            Cantidad: 1, // Asumiendo que la cantidad es 1 por cada item en el carrito
            TipoEntrega: tipoEntrega
        };

        // Añade cada observable de la compra al array
        purchaseObservables.push(
            this.http.post('http://localhost:5257/api/ProductosControlador/realizar-compra', compraRequest).pipe(
                map((response: any) => {
                    console.log('Compra registrada:', response);
                    return { success: true, product: producto };
                })
            )
        );
    });

    // Usa forkJoin para esperar a que todas las compras se completen
    forkJoin(purchaseObservables).subscribe(
        (results) => {
            // Todos los resultados exitosos, pero aún debemos verificar errores de Bad Request
            results.forEach(res => {
                if (!res.success) {
                    allPurchasesSuccessful = false;
                    errorMessage += `Error al comprar ${res.product.nombre}. `;
                }
            });

            if (allPurchasesSuccessful) {
                alert('¡Pago y compra realizados exitosamente para todos los productos!');
                this.purchasedProducts = [...this.purchasedProducts, ...this.cartItems];
                this.cartItems = [];
                this.cardNumber = '';
                this.cardName = '';
                this.cardExpiry = '';
                this.cardCVC = '';
                this.closePaymentMenu();
                this.setActiveLink('Inicio');
            } else {
                alert(`Algunas compras no se pudieron completar: ${errorMessage}`);
                // Aquí podrías decidir qué hacer con los productos que fallaron
            }
        },
        (error: HttpErrorResponse) => {
            console.error('Error general al procesar las compras:', error);
            if (error.error && error.error.error) { // El campo 'error' viene del backend con el mensaje de SqlException
                alert(`Error al registrar la compra: ${error.error.error}`);
            } else {
                alert('Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.');
            }
        }
    );
  }

  closePaymentMenu(): void {
    this.showPaymentMenu = false;
    this.showShoppingCartMenu = true;
    this.paymentMethod = '';
    this.currentActiveLink = 'Carrito';
  }

  loginUser(): void {
    if (!this.loginEmail || !this.loginPassword) {
      alert('Por favor, ingresa tu correo y contraseña.');
      return;
    }

this.http.post<any>('http://localhost:5257/api/UsuariosControlador/login', {
    email: this.loginEmail,
    contrasena: this.loginPassword
  }).subscribe(      (response: any) => {
        if (response && response.usuario) {
          // El backend debe devolver un objeto con usuario, userType y datos extra según el rol
          this.loggedInUser = response.usuario as LoggedInUser;

          // Si es cliente, carga historial de pedidos
          if (this.loggedInUser.userType === 'Cliente') {
            this.loadCustomerOrders(this.loggedInUser.UsuarioID);
          }
          // Si es vendedor, carga productos en venta
          if (this.loggedInUser.userType === 'Vendedor') {
            this.productoService.getProductos().subscribe(allProducts => {
              this.sellingProducts = allProducts.filter(p => p.vendedorID === this.loggedInUser!.vendedorID);
            });
          }

          alert('¡Inicio de sesión exitoso como ' + this.loggedInUser.Email + ' con rol: ' + this.loggedInUser.userType + '!');
          this.loginEmail = '';
          this.loginPassword = '';
          this.setActiveLink('Mi Cuenta');
        } else {
          console.error('Login fallido: usuario no encontrado o datos incorrectos');
          alert('Correo o contraseña incorrectos.');
          this.loggedInUser = null;
        }
      },
      (error: any) => {
        console.error('Error en el login:', error);
        // Manejar errores específicos del backend si se envían en la respuesta de error
        if (error.error && error.error.mensaje) {
          alert('Error al intentar iniciar sesión: ' + error.error.mensaje);
        } else {
          alert('Error al intentar iniciar sesión.');
        }
      }
    );
  }


  registerUser(): void {
    this.registrationMessage = ''; // Clear previous messages

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.registrationMessage = 'Las contraseñas no coinciden.';
      return;
    }

    // Prepare the basic Usuario object
    const registroCompleto: any = {
    tipo: this.registerUserType, // 'Cliente', 'Empleado' o 'Vendedor'
    nombre: this.registerNombre,
    apellido: this.registerApellido,
    email: this.registerEmail,
    contrasena: this.registerPassword,
    tipodeusuario: this.registerUserType, // 'Cliente', 'Empleado' o 'Vendedor'
  };

    // First, register the basic user information
    if (this.registerUserType === 'Cliente') {
      registroCompleto.direccion = this.registerDireccion;
      registroCompleto.ciudad = this.registerCiudad;
      registroCompleto.codigoPostal = this.registerCodigoPostal;
    } else if (this.registerUserType === 'Empleado') {
      registroCompleto.fechaDeContratacion = this.registerFechaContratacion;
      registroCompleto.rolInterno = this.registerRolInterno;
      registroCompleto.salario = this.registerSalario;
    } else if (this.registerUserType === 'Vendedor') {
      registroCompleto.nombreDeTienda = this.registerNombreTienda;
      registroCompleto.cuentaDeBanco = this.registerCuentaBanco;
    }

    // Usar el servicio de usuario para el registro
    this.http.post('http://localhost:5257/api/UsuariosControlador/registrar-completo', registroCompleto)
    .subscribe(
        (response: any) => {
          this.registrationMessage = 'Registro exitoso. ¡Bienvenido!';
          this.resetRegistrationForm();
          // Puedes guardar el usuario logueado aquí si el backend lo retorna
          this.setActiveLink('Inicio');
        },
        (error: any) => {
          console.error('Error en el registro:', error);
          this.registrationMessage = `Error en el registro: ${error.message || 'Error desconocido'}`;
          // Manejar errores específicos del backend si se envían en la respuesta de error
          if (error.error && error.error.mensaje) {
            this.registrationMessage = error.error.mensaje;
          }
        }
      );
  }

// Helper to reset the registration form
resetRegistrationForm(): void {
  this.registerNombre = '';
  this.registerApellido = '';
  this.registerEmail = '';
  this.registerTelefono = '';
  this.registerPassword = '';
  this.registerConfirmPassword = '';
  this.registerUserType = 'Cliente';
  this.registerDireccion = '';
  this.registerCiudad = '';
  this.registerCodigoPostal = '';
  this.registerFechaContratacion = '';
  this.registerRolInterno = '';
  this.registerSalario = null;
  this.registerNombreTienda = '';
  this.registerCuentaBanco = '';
}

  // Nuevo método para que un cliente convierta su cuenta a vendedor
  convertAccountToSeller(): void {
    if (!this.loggedInUser || this.loggedInUser.userType !== 'Cliente') {
      alert('Esta opción solo está disponible para clientes.');
      return;
    }

    if (!this.convertToSellerNombreTienda) {
      alert('Por favor, ingresa el nombre de tu tienda.');
      return;
    }

    // Obtener el RolID de 'Vendedor'
    this.rolDeUsuarioService.getRolesDeUsuario().subscribe(roles => {
      const vendedorRol = roles.find(r => r.NombreRol === 'Vendedor');
      if (vendedorRol) {
        // Verificar si el UsuarioRol ya existe para evitar duplicados
        this.usuarioRolService.getUsuarioRolByIds(this.loggedInUser!.UsuarioID, vendedorRol.RolID).subscribe(existingUserRol => {
          if (existingUserRol) {
            console.log('El usuario ya tiene el rol de Vendedor.');
            // Si ya tiene el rol, simplemente actualizar su información de Tienda si es necesario o continuar
            this.updateOrCreateTiendaForConversion(this.loggedInUser!, vendedorRol.RolID);
          } else {
            // Asignar el rol de vendedor al usuario existente
            const newUsuarioRol: UsuarioRol = {
              UsuarioID: this.loggedInUser!.UsuarioID,
              RolID: vendedorRol.RolID
            };
            this.usuarioRolService.addUsuarioRol(newUsuarioRol).subscribe(
              () => {
                console.log('Rol de Vendedor asignado al usuario:', this.loggedInUser!.Email);
                this.updateOrCreateTiendaForConversion(this.loggedInUser!, vendedorRol.RolID);
              },
              (error: any) => {
                console.error('Error al asignar rol de vendedor:', error);
                alert('Error al convertir la cuenta a vendedor: no se pudo asignar el rol.');
              }
            );
          }
        });
      } else {
        alert('El rol "Vendedor" no se encontró en la configuración del sistema.');
      }
    });
  }

  private updateOrCreateTiendaForConversion(user: LoggedInUser, vendedorRolId: number): void {
    // Buscar si ya existe una tienda para este UsuarioID (ClienteID)
    this.tiendaService.getTiendaById(user.UsuarioID).subscribe(
      (existingTienda: Tienda | undefined) => {
        const tiendaData: Tienda = {
          ...user as Usuario, // Copia las propiedades de Usuario
          vendedorID: user.UsuarioID, // El ClienteID del usuario es el VendedorID
          nombreDeTienda: this.convertToSellerNombreTienda,
          CuentaDeBanco: this.convertToSellerCuentaBanco,
          Activo: true,
          FechaDeRegistro: user.FechaDeRegistro // Mantener la fecha de registro original del usuario
        };

        if (existingTienda) {
          // Si ya existe, actualizarla
          this.tiendaService.updateTienda(tiendaData).subscribe(
            (updatedTienda) => {
              this.handleConversionSuccess(user, updatedTienda as Tienda);
            },
            (error) => {
              console.error('Error al actualizar datos de tienda:', error);
              alert('Error al convertir la cuenta a vendedor: no se pudieron actualizar los datos de la tienda.');
            }
          );
        } else {
          // Si no existe, crearla
          this.tiendaService.addTienda(tiendaData).subscribe(
            (addedTienda: Tienda) => {
              this.handleConversionSuccess(user, addedTienda);
            },
            (error: any) => {
              console.error('Error al agregar datos de tienda:', error);
              alert('Error al convertir la cuenta a vendedor: no se pudieron guardar los datos de la tienda.');
            }
          );
        }
      },
      (error) => {
        console.error('Error al verificar tienda existente:', error);
        alert('Error al convertir la cuenta a vendedor: Fallo al verificar tienda.');
      }
    );
  }

  private handleConversionSuccess(user: LoggedInUser, tienda: Tienda): void {
    // Actualizar el objeto loggedInUser para reflejar el nuevo rol y propiedades
    this.loggedInUser = {
      ...user,
      ...tienda,
      userType: 'Vendedor'
    } as LoggedInUser;

    // Recargar productos de venta para el nuevo vendedor
    this.productoService.getProductos().subscribe(allProducts => {
      this.sellingProducts = allProducts.filter(p => p.vendedorID === this.loggedInUser!.vendedorID);
    });

    alert('¡Felicidades! Tu cuenta ha sido convertida a vendedor exitosamente.');
    this.convertToSellerNombreTienda = '';
    this.convertToSellerCuentaBanco = '';
    this.setActiveLink('Vender'); // Redirige al formulario de subir producto
  }
  // Métodos para el historial de pedidos
  viewOrderHistory(): void {
    if (this.loggedInUser && this.loggedInUser.userType === 'Cliente') {
      this.showOrderHistoryMenu = true;
      this.currentActiveLink = 'HistorialPedidos';
      this.loadCustomerOrders(this.loggedInUser.UsuarioID);
    } else {
      alert('Debes iniciar sesión como cliente para ver tu historial de pedidos.');
      this.setActiveLink('Mi Cuenta');
    }
  }

  loadCustomerOrders(clienteId: number): void {
    this.pedidoService.getPedidos().subscribe(
      (pedidos: Pedido[]) => {
        this.customerOrders = pedidos.filter(p => p.ClienteID === clienteId);
        console.log('Pedidos del cliente cargados:', this.customerOrders);
      },
      (error: any) => {
        console.error('Error al cargar pedidos del cliente:', error);
      }
    );
  }

  viewOrderDetail(order: Pedido): void {
    this.selectedOrder = order;
    this.selectedOrderDetails = []; // Limpiar detalles anteriores
    this.selectedOrderPayment = null;
    this.selectedOrderFactura = null;
    this.selectedOrderEstado = null; // Limpiar estado anterior

    // Cargar detalles del pedido
    this.detalleDePedidoService.getDetallesByPedidoId(order.PedidoID).subscribe(
      (details: DetalleDePedido[]) => {
        this.selectedOrderDetails = []; // Asegurarse de que esté vacío antes de agregar
        details.forEach(detail => {
          this.productoService.getProductoById(detail.ProductoID).subscribe(
            (product: Producto | undefined) => {
              if (product) {
                this.selectedOrderDetails.push({ product, detail });
              }
            }
          );
        });
      },
      (error: any) => {
        console.error('Error al cargar detalles del pedido:', error);
      }
    );

    // Cargar información de pago
    this.pagoService.getPagosByPedidoId(order.PedidoID).subscribe(
      (pago: Pago | undefined) => {
        this.selectedOrderPayment = pago || null;
      },
      (error: any) => {
        console.error('Error al cargar pago del pedido:', error);
      }
    );

    // Cargar información de la factura
    this.facturaService.getFacturaByPedidoId(order.PedidoID).subscribe(
      (factura: Factura | undefined) => {
        this.selectedOrderFactura = factura || null;
      },
      (error: any) => {
        console.error('Error al cargar factura del pedido:', error);
      }
    );

    // Cargar el estado del pedido
    this.estadoPedidoService.getEstadoById(order.EstadoDelPedidoID).subscribe(
      (estado: EstadoPedido | undefined) => {
        this.selectedOrderEstado = estado || null;
      },
      (error: any) => {
        console.error('Error al cargar estado del pedido:', error);
      }
    );
  }

  backToOrderHistoryList(): void {
    this.selectedOrder = null;
    this.selectedOrderDetails = [];
    this.selectedOrderPayment = null;
    this.selectedOrderFactura = null;
    this.selectedOrderEstado = null;
  }

  logoutUser(): void {
    this.loggedInUser = null;
    this.cartItems = [];
    this.sellingProducts = [];
    this.purchasedProducts = [];
    this.customerOrders = []; // Limpiar pedidos del cliente
    this.selectedOrder = null; // Limpiar pedido seleccionado
    alert('Has cerrado sesión.');
    this.setActiveLink('Inicio');
  }
}
