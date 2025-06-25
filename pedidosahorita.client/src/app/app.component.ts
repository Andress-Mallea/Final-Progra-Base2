import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
import { HttpClientModule } from '@angular/common/http'; // Mantenerlo por si se usa en el futuro, aunque los servicios son mock
import { forkJoin, Observable } from 'rxjs'; // Import forkJoin and Observable
import { map } from 'rxjs/operators'; // Import map

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

/**
 * @type LoggedInUser
 * @description Representa el usuario actualmente autenticado, combinando las propiedades
 * de la interfaz base Usuario con las propiedades opcionales de Cliente, Empleado y Tienda,
 * y añadiendo una propiedad `userType` para identificar el rol principal del usuario en el frontend.
 * Las propiedades son en PascalCase para coincidir con los modelos C#.
 */
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
    private pedidoService: PedidoService
  ) { }

  ngOnInit(): void {
    this.loadProducts(); // Carga todos los productos
    this.loadTiendas(); // Carga todas las tiendas para la vista de inicio
  }

  loadProducts(): void {
    this.productoService.getProductos().subscribe(
      (data: Producto[]) => {
        this.products = data;
        console.log('Productos cargados:', this.products); // Log para depuración
      },
      (error: any) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  // Nuevo método: Cargar todas las tiendas
  loadTiendas(): void {
    this.tiendaService.getTiendas().subscribe(
      (data: Tienda[]) => {
        this.tiendas = data;
      },
      (error: any) => {
        console.error('Error al cargar tiendas:', error);
      }
    );
  }

  // Nuevo método: Ver productos de una tienda específica
  viewStoreProducts(store: Tienda): void {
    this.selectedStore = store;
    // Filtra los productos que pertenecen a esta tienda por su VendedorID
    this.storeProducts = this.products.filter(p => p.VendedorID === store.VendedorID);
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
    console.log('Viendo productos de la tienda:', store.NombreDeTienda);
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
    const index = this.cartItems.findIndex(product => product.id === productToRemove.id);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      console.log('Producto eliminado del carrito:', productToRemove);
    }
  }

  getTotalCartAmount(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
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
    console.log('Viendo detalles de:', product.name);
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
        // Lógica para el botón "Vender":
        if (this.loggedInUser) {
          if (this.loggedInUser.userType === 'Vendedor') {
            this.showSellMenu = true; // Mostrar formulario de venta directamente
          } else if (this.loggedInUser.userType === 'Cliente') {
            // Si es cliente, mostrar el menú para convertir a vendedor
            this.showConvertToSellerMenu = true;
            this.currentActiveLink = 'ConvertToSeller'; // Nuevo estado para el enlace activo
          } else {
            alert('Debes ser un vendedor para subir productos. Por favor, inicia sesión o regístrate como vendedor.');
            this.showLoginMenu = true; // Opcional: Redirigir a login
            this.currentActiveLink = 'Iniciar Sesion';
          }
        } else {
          alert('Debes iniciar sesión para vender productos.');
          this.showLoginMenu = true; // Redirigir a login
          this.currentActiveLink = 'Iniciar Sesion';
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

    // AHORA SOLO UN VENDEDOR PUEDE SUBIR PRODUCTOS
    if (!this.loggedInUser || this.loggedInUser.userType !== 'Vendedor') {
      alert('Solo los vendedores pueden subir productos. Por favor, convierte tu cuenta a vendedor.');
      return;
    }

    // Si el usuario es un vendedor, obtenemos su VendedorID
    const sellerId = (this.loggedInUser as Tienda).VendedorID;

    if (sellerId === undefined) {
      alert('No se pudo determinar el ID del vendedor para subir el producto.');
      return;
    }

    const newProduct: Producto = {
      id: 0, // El ID será asignado por el servicio o backend
      name: this.newProductName,
      description: this.newProductDescription,
      price: this.newProductPrice,
      image: this.newProductImage,
      VendedorID: sellerId, // Asignamos el ID del usuario logueado como vendedor (PascalCase)
      StockDisponible: 1, // Valor por defecto, se podría añadir un campo al formulario (PascalCase)
      Activo: true, // Por defecto activo (PascalCase)
      FechaCreacion: new Date() // Fecha actual (PascalCase)
    };

    this.productoService.addProducto(newProduct).subscribe(
      (addedProduct: Producto) => {
        this.products.push(addedProduct);
        // Si el usuario es un vendedor, añadirlo a su lista de productos en venta
        if (this.loggedInUser && this.loggedInUser.userType === 'Vendedor') {
          this.sellingProducts = [...this.sellingProducts, addedProduct]; // Asegura la reactividad
        }
        console.log('Producto subido:', addedProduct);
        alert('¡Producto "' + addedProduct.name + '" subido con éxito!');

        this.newProductName = '';
        this.newProductDescription = '';
        this.newProductPrice = null;
        this.newProductImage = '';
        this.setActiveLink('Productos'); // Redirige a la vista de productos generales
      },
      (error: any) => {
        console.error('Error al subir producto:', error);
        alert('Hubo un error al subir el producto.');
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

    alert('¡Pago simulado exitoso!');
    this.purchasedProducts = [...this.purchasedProducts, ...this.cartItems];
    this.cartItems = [];
    this.cardNumber = '';
    this.cardName = '';
    this.cardExpiry = '';
    this.cardCVC = '';
    this.closePaymentMenu();
    this.setActiveLink('Inicio');
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

    this.usuarioService.getUsuarios().subscribe(
      (usuarios: Usuario[]) => {
        const foundUser = usuarios.find(u => u.Email === this.loginEmail && u.ContrasenaHash === this.loginPassword);
        if (foundUser) {
          // Obtener todos los roles asociados al usuario
          this.usuarioRolService.getUsuariosRoles().subscribe(
            (userRoles: UsuarioRol[]) => {
              const rolesObservables: Observable<RolDeUsuario | undefined>[] = userRoles
                .filter(ur => ur.UsuarioID === foundUser.UsuarioID)
                .map(ur => this.rolDeUsuarioService.getRolDeUsuarioById(ur.RolID));

              // Usar forkJoin para esperar que todos los observables de roles se resuelvan
              forkJoin(rolesObservables.filter(Boolean) as Observable<RolDeUsuario>[]).subscribe(
                (resolvedRoles: RolDeUsuario[]) => {
                  let primaryRole: RolDeUsuario | undefined;

                  // Prioridad: Vendedor > Cliente (ejemplo simple)
                  if (resolvedRoles.some(r => r.NombreRol === 'Vendedor')) {
                    primaryRole = resolvedRoles.find(r => r.NombreRol === 'Vendedor');
                  } else if (resolvedRoles.some(r => r.NombreRol === 'Cliente')) {
                    primaryRole = resolvedRoles.find(r => r.NombreRol === 'Cliente');
                  }
                  // Puedes añadir más lógica de prioridad si hay otros roles como Empleado, Administrador, Repartidor

                  if (primaryRole) {
                    this.loggedInUser = { ...foundUser, userType: primaryRole.NombreRol as UserRole };

                    // Cargar datos específicos según el tipo de usuario y combinarlos con loggedInUser
                    if (primaryRole.NombreRol === 'Cliente') {
                      this.clienteService.getClienteById(foundUser.UsuarioID).subscribe(
                        (cliente: Cliente | undefined) => {
                          if (cliente) {
                            this.loggedInUser = { ...this.loggedInUser!, ...cliente } as LoggedInUser;
                            // Cargar historial de pedidos para el cliente logueado
                            this.loadCustomerOrders(this.loggedInUser!.UsuarioID);
                          }
                        }
                      );
                    } else if (primaryRole.NombreRol === 'Empleado') {
                      this.empleadoService.getEmpleadoById(foundUser.UsuarioID).subscribe(
                        (empleado: Empleado | undefined) => {
                          if (empleado) {
                            this.loggedInUser = { ...this.loggedInUser!, ...empleado } as LoggedInUser;
                          }
                        }
                      );
                    } else if (primaryRole.NombreRol === 'Vendedor') {
                      this.tiendaService.getTiendaById(foundUser.UsuarioID).subscribe(
                        (tienda: Tienda | undefined) => {
                          if (tienda) {
                            this.loggedInUser = { ...this.loggedInUser!, ...tienda } as LoggedInUser;
                            this.productoService.getProductos().subscribe(allProducts => {
                              this.sellingProducts = allProducts.filter(p => p.VendedorID === tienda.VendedorID);
                            });
                          }
                        }
                      );
                    }

                    // Productos comprados (esto podría ser parte de los pedidos en el historial)
                    if (this.loggedInUser!.userType === 'Cliente') {
                      this.purchasedProducts = [
                        { id: 9, name: 'Smartwatch', description: 'Reloj inteligente con GPS.', price: 200.00, VendedorID: 0, StockDisponible: 0, Activo: true, FechaCreacion: new Date() },
                        { id: 10, name: 'Batería Externa', description: 'Carga tus dispositivos en movimiento.', price: 30.00, VendedorID: 0, StockDisponible: 0, Activo: true, FechaCreacion: new Date() }
                      ];
                    }

                    alert('¡Inicio de sesión simulado exitoso como ' + this.loggedInUser!.Email + ' con rol: ' + this.loggedInUser!.userType + '!');
                    this.loginEmail = '';
                    this.loginPassword = '';
                    this.setActiveLink('Mi Cuenta');
                  } else {
                    alert('Usuario encontrado pero sin rol principal asignado.');
                    this.loggedInUser = null;
                  }
                },
                (error: any) => {
                  console.error('Error al resolver los roles del usuario:', error);
                  alert('Error al cargar roles de usuario.');
                }
              );
            },
            (error: any) => {
              console.error('Error al cargar roles de usuario:', error);
              alert('Error al cargar roles de usuario.');
            }
          );

        } else {
          alert('Correo o contraseña incorrectos.');
          this.loggedInUser = null;
        }
      },
      (error: any) => {
        console.error('Error al obtener usuarios:', error);
        alert('Error al intentar iniciar sesión.');
      }
    );
  }


  registerUser(): void {
    if (!this.registerNombre || !this.registerApellido || !this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      alert('Por favor, rellena los campos de Nombre, Apellido, Email y Contraseña.');
      return;
    }
    if (this.registerPassword !== this.registerConfirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const newUser: Usuario = {
      UsuarioID: 0,
      Nombre: this.registerNombre,
      Apellido: this.registerApellido,
      Email: this.registerEmail,
      Telefono: this.registerTelefono,
      ContrasenaHash: this.registerPassword,
      FechaDeRegistro: new Date(),
      Activo: true
    };

    this.usuarioService.addUsuario(newUser).subscribe(
      (addedUser: Usuario) => {
        console.log('Usuario base registrado:', addedUser);

        this.rolDeUsuarioService.getRolesDeUsuario().subscribe(
          (roles: RolDeUsuario[]) => {
            const selectedRole = roles.find(r => r.NombreRol === this.registerUserType);
            if (selectedRole) {
              const newUserRol: UsuarioRol = {
                UsuarioID: addedUser.UsuarioID,
                RolID: selectedRole.RolID
              };
              this.usuarioRolService.addUsuarioRol(newUserRol).subscribe(
                (addedUserRol: UsuarioRol) => {
                  console.log('Rol de usuario asignado:', addedUserRol);

                  let specificUserData: Partial<Cliente> | Partial<Empleado> | Partial<Tienda> | null = null;

                  if (this.registerUserType === 'Cliente') {
                    if (!this.registerDireccion || !this.registerCiudad || !this.registerCodigoPostal) {
                      alert('Por favor, rellena los datos de dirección para el cliente.');
                      return;
                    }
                    specificUserData = {
                      ClienteID: addedUser.UsuarioID,
                      Direccion: this.registerDireccion,
                      Ciudad: this.registerCiudad,
                      CodigoPostal: this.registerCodigoPostal
                    };
                    this.clienteService.addCliente({ ...addedUser, ...specificUserData as Cliente }).subscribe();
                  } else if (this.registerUserType === 'Empleado') {
                    if (!this.registerFechaContratacion || this.registerSalario === null || this.registerSalario <= 0) {
                      alert('Por favor, rellena los datos de contratación y salario para el empleado.');
                      return;
                    }
                    specificUserData = {
                      EmpleadoID: addedUser.UsuarioID,
                      FechaDeContratacion: new Date(this.registerFechaContratacion),
                      RolInterno: this.registerRolInterno,
                      Salario: this.registerSalario
                    };
                    this.empleadoService.addEmpleado({ ...addedUser, ...specificUserData as Empleado }).subscribe();
                  } else if (this.registerUserType === 'Vendedor') {
                    if (!this.registerNombreTienda) {
                      alert('Por favor, ingresa el nombre de tu tienda.');
                      return;
                    }
                    specificUserData = {
                      VendedorID: addedUser.UsuarioID,
                      NombreDeTienda: this.registerNombreTienda,
                      CuentaDeBanco: this.registerCuentaBanco,
                      Activo: true
                    };
                    this.tiendaService.addTienda({ ...addedUser, ...specificUserData as Tienda }).subscribe();
                  }

                  // Asignar el loggedInUser combinando las propiedades del usuario base y las específicas
                  this.loggedInUser = {
                    ...addedUser,
                    ...(specificUserData || {}),
                    userType: this.registerUserType
                  } as LoggedInUser;

                  alert('¡Registro simulado exitoso para ' + this.loggedInUser.Email + ' como ' + this.loggedInUser.userType + '!');

                  // Limpiar campos después del registro
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

                  this.setActiveLink('Mi Cuenta'); // Dirige al usuario a su perfil después del registro
                },
                (error: any) => {
                  console.error('Error al asignar rol de usuario:', error);
                  alert('Error al asignar rol de usuario.');
                }
              );
            } else {
              alert('Rol de usuario seleccionado no encontrado.');
            }
          },
          (error: any) => {
            console.error('Error al obtener roles de usuario:', error);
            alert('Error al obtener roles de usuario.');
          }
        );
      },
      (error: any) => {
        console.error('Error al registrar usuario:', error);
        alert('Hubo un error al registrar el usuario. El correo ya podría estar en uso.');
      }
    );
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
          VendedorID: user.UsuarioID, // El ClienteID del usuario es el VendedorID
          NombreDeTienda: this.convertToSellerNombreTienda,
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
      this.sellingProducts = allProducts.filter(p => p.VendedorID === this.loggedInUser!.VendedorID);
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
