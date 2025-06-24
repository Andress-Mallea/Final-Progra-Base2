import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule

// Importa las nuevas interfaces de los modelos
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

// Importa los nuevos servicios
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
  cartItems: Producto[] = [];
  showShoppingCartMenu: boolean = false;
  currentActiveLink: string = 'Inicio';
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
    this.loadProducts();
    // Aquí puedes cargar datos iniciales para otros servicios si es necesario
    // Por ejemplo: this.loadCategories();
  }

  loadProducts(): void {
    this.productoService.getProductos().subscribe(
      (data: Producto[]) => {
        this.products = data;
      },
      (error: any) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  // Método para añadir un producto al carrito
  addToCart(product: Producto): void {
    this.cartItems.push(product);
    console.log('Producto añadido al carrito:', product);
  }

  // Método para quitar un producto del carrito
  removeFromCart(productToRemove: Producto): void {
    const index = this.cartItems.findIndex(product => product.id === productToRemove.id);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      console.log('Producto eliminado del carrito:', productToRemove);
    }
  }

  // Método para obtener el total del carrito
  getTotalCartAmount(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  // Método para alternar la visibilidad del menú del carrito
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
    }
  }

  // Método para ver los detalles de un producto
  viewProductDetail(product: Producto): void {
    this.selectedProduct = product;
    this.currentActiveLink = 'ProductDetail';
    this.showProductDetailMenu = true;
    this.showShoppingCartMenu = false;
    this.showSellMenu = false;
    this.showPaymentMenu = false;
    this.showLoginMenu = false;
    this.showRegisterMenu = false;
    console.log('Viendo detalles de:', product.name);
  }

  // Método para establecer el enlace de navegación activo y controlar la visibilidad de los menús
  setActiveLink(linkName: string): void {
    this.currentActiveLink = linkName;

    // Reiniciar visibilidad de todos los menús a false
    this.showShoppingCartMenu = false;
    this.showSellMenu = false;
    this.showProductDetailMenu = false;
    this.showPaymentMenu = false;
    this.showLoginMenu = false;
    this.showRegisterMenu = false;

    // Activar el menú correspondiente
    switch (linkName) {
      case 'Carrito':
        this.showShoppingCartMenu = true;
        break;
      case 'Vender':
        this.showSellMenu = true;
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
    }
  }

  // Método para simular la subida de un producto (con validación)
  uploadProduct(): void {
    if (!this.newProductName || !this.newProductDescription || this.newProductPrice === null || this.newProductPrice <= 0) {
      alert('Por favor, rellena todos los campos requeridos (Nombre, Descripción, Precio mayor a 0).');
      return;
    }

    // Un cliente solo puede vender si tiene el rol de Vendedor o es una Tienda
    if (!this.loggedInUser || (this.loggedInUser.userType !== 'Vendedor' && this.loggedInUser.userType !== 'Cliente')) {
      alert('Solo los vendedores o clientes con permiso de venta pueden subir productos.');
      return;
    }

    let sellerId: number | undefined;
    if (this.loggedInUser.userType === 'Vendedor') {
        sellerId = (this.loggedInUser as Tienda).VendedorID;
    } else if (this.loggedInUser.userType === 'Cliente') {
        // Asumimos que ClienteID es el VendedorID si el cliente está vendiendo
        sellerId = (this.loggedInUser as Cliente).ClienteID;
    }

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
      VendedorID: sellerId, // Asignamos el ID del usuario logueado como vendedor
      StockDisponible: 1, // Valor por defecto, se podría añadir un campo al formulario
      Activo: true, // Por defecto activo
      FechaCreacion: new Date() // Fecha actual
    };

    this.productoService.addProducto(newProduct).subscribe(
      (addedProduct: Producto) => {
        this.products.push(addedProduct);
        if (this.loggedInUser && (this.loggedInUser.userType === 'Vendedor' || this.loggedInUser.userType === 'Cliente')) {
          this.sellingProducts.push(addedProduct);
        }
        console.log('Producto subido:', addedProduct);
        alert('¡Producto "' + addedProduct.name + '" subido con éxito!');

        this.newProductName = '';
        this.newProductDescription = '';
        this.newProductPrice = null;
        this.newProductImage = '';
        this.setActiveLink('Productos');
      },
      (error: any) => {
        console.error('Error al subir producto:', error);
        alert('Hubo un error al subir el producto.');
      }
    );
  }

  // Nuevo método para proceder al menú de pago
  proceedToPayment(): void {
    this.showShoppingCartMenu = false;
    this.showPaymentMenu = true;
    this.paymentMethod = '';
    this.currentActiveLink = 'Payment';
    console.log('Procediendo al pago...');
  }

  // Nuevo método para seleccionar el método de pago
  selectPaymentMethod(method: string): void {
    this.paymentMethod = method;
    console.log('Método de pago seleccionado:', method);
  }

  // Nuevo método para procesar el pago (con validación de tarjeta)
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

  // Nuevo método para cerrar el menú de pago y volver al carrito
  closePaymentMenu(): void {
    this.showPaymentMenu = false;
    this.showShoppingCartMenu = true;
    this.paymentMethod = '';
    this.currentActiveLink = 'Carrito';
  }

  // Método para simular el inicio de sesión
  loginUser(): void {
    if (!this.loginEmail || !this.loginPassword) {
      alert('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    // Simular la búsqueda del usuario por email y contraseña (simplificado)
    this.usuarioService.getUsuarios().subscribe(
      (usuarios: Usuario[]) => {
        const foundUser = usuarios.find(u => u.Email === this.loginEmail && u.ContrasenaHash === this.loginPassword); // ContrasenaHash simplificado
        if (foundUser) {
          // Asigna el usuario encontrado a loggedInUser
          this.loggedInUser = { ...foundUser, userType: 'Cliente' as UserRole }; // Tipo por defecto, se refinará

          // Simular la carga de roles y datos específicos del tipo de usuario
          this.usuarioRolService.getUsuariosRoles().subscribe(
            (userRoles: UsuarioRol[]) => {
              const roles = userRoles.filter(ur => ur.UsuarioID === foundUser.UsuarioID);
              if (roles.length > 0) {
                // Asumimos un solo rol principal para simplificar la simulación
                this.rolDeUsuarioService.getRolDeUsuarioById(roles[0].RolID).subscribe(
                  (rol: RolDeUsuario | undefined) => {
                    if (rol) {
                      this.loggedInUser!.userType = rol.NombreRol as UserRole; // Asigna el rol real

                      // Cargar datos específicos según el tipo de usuario y combinarlos con loggedInUser
                      if (rol.NombreRol === 'Cliente') {
                        this.clienteService.getClienteById(foundUser.UsuarioID).subscribe(
                          (cliente: Cliente | undefined) => {
                            if (cliente) {
                              this.loggedInUser = { ...this.loggedInUser!, ...cliente } as LoggedInUser;
                            }
                          }
                        );
                      } else if (rol.NombreRol === 'Empleado') {
                        this.empleadoService.getEmpleadoById(foundUser.UsuarioID).subscribe(
                          (empleado: Empleado | undefined) => {
                            if (empleado) {
                              this.loggedInUser = { ...this.loggedInUser!, ...empleado } as LoggedInUser;
                            }
                          }
                        );
                      } else if (rol.NombreRol === 'Vendedor') {
                        this.tiendaService.getTiendaById(foundUser.UsuarioID).subscribe(
                          (tienda: Tienda | undefined) => {
                            if (tienda) {
                              this.loggedInUser = { ...this.loggedInUser!, ...tienda } as LoggedInUser;
                              // Cargar productos que el vendedor está vendiendo
                              this.productoService.getProductos().subscribe(allProducts => {
                                this.sellingProducts = allProducts.filter(p => p.VendedorID === tienda.VendedorID);
                              });
                            }
                          }
                        );
                      }
                      // Aquí también puedes cargar `purchasedProducts` si el `loggedInUser` es un cliente
                      if (this.loggedInUser!.userType === 'Cliente') {
                        // Simulación de productos comprados para el cliente logueado
                        this.purchasedProducts = [
                          { id: 9, name: 'Smartwatch', description: 'Reloj inteligente con GPS.', price: 200.00 },
                          { id: 10, name: 'Batería Externa', description: 'Carga tus dispositivos en movimiento.', price: 30.00 }
                        ];
                      }

                      alert('¡Inicio de sesión simulado exitoso como ' + this.loggedInUser!.Email + ' con rol: ' + this.loggedInUser!.userType + '!');
                      this.loginEmail = '';
                      this.loginPassword = '';
                      this.setActiveLink('Mi Cuenta');
                    }
                  }
                );
              } else {
                alert('Usuario encontrado pero sin rol asignado.');
                this.loggedInUser = null; // No loguear si no tiene rol
              }
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

  // Método para simular el registro de un nuevo usuario
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
      UsuarioID: 0, // Será asignado por el servicio
      Nombre: this.registerNombre,
      Apellido: this.registerApellido,
      Email: this.registerEmail,
      Telefono: this.registerTelefono,
      ContrasenaHash: this.registerPassword, // En un entorno real, se debería hashear aquí o en el backend
      FechaDeRegistro: new Date(),
      Activo: true
    };

    this.usuarioService.addUsuario(newUser).subscribe(
      (addedUser: Usuario) => {
        console.log('Usuario base registrado:', addedUser);

        // Asignar rol y datos específicos según el tipo de usuario
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

                  let specificUserData: Cliente | Empleado | Tienda | null = null;

                  if (this.registerUserType === 'Cliente') {
                    if (!this.registerDireccion || !this.registerCiudad || !this.registerCodigoPostal) {
                      alert('Por favor, rellena los datos de dirección para el cliente.');
                      return;
                    }
                    specificUserData = {
                      ...addedUser, // Hereda de Usuario
                      ClienteID: addedUser.UsuarioID,
                      Direccion: this.registerDireccion,
                      Ciudad: this.registerCiudad,
                      CodigoPostal: this.registerCodigoPostal
                    };
                    this.clienteService.addCliente(specificUserData as Cliente).subscribe();
                  } else if (this.registerUserType === 'Empleado') {
                    if (!this.registerFechaContratacion || this.registerSalario === null || this.registerSalario <= 0) {
                      alert('Por favor, rellena los datos de contratación y salario para el empleado.');
                      return;
                    }
                    specificUserData = {
                      ...addedUser, // Hereda de Usuario
                      EmpleadoID: addedUser.UsuarioID,
                      FechaDeContratacion: new Date(this.registerFechaContratacion),
                      RolInterno: this.registerRolInterno,
                      Salario: this.registerSalario
                    };
                    this.empleadoService.addEmpleado(specificUserData as Empleado).subscribe();
                  } else if (this.registerUserType === 'Vendedor') {
                    if (!this.registerNombreTienda) {
                      alert('Por favor, ingresa el nombre de tu tienda.');
                      return;
                    }
                    specificUserData = {
                      ...addedUser, // Hereda de Usuario
                      VendedorID: addedUser.UsuarioID,
                      NombreDeTienda: this.registerNombreTienda,
                      CuentaDeBanco: this.registerCuentaBanco,
                      Activo: true
                    };
                    this.tiendaService.addTienda(specificUserData as Tienda).subscribe();
                  }

                  // Asignar el loggedInUser combinando las propiedades del usuario base y las específicas
                  this.loggedInUser = {
                    ...addedUser,
                    ...(specificUserData || {}), // Asegúrate de que specificUserData sea un objeto o un objeto vacío
                    userType: this.registerUserType
                  } as LoggedInUser; // Cast para asegurar la compatibilidad con LoggedInUser

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

  // Nuevo método para cerrar sesión
  logoutUser(): void {
    this.loggedInUser = null;
    this.cartItems = [];
    this.sellingProducts = [];
    this.purchasedProducts = [];
    alert('Has cerrado sesión.');
    this.setActiveLink('Inicio');
  }
}