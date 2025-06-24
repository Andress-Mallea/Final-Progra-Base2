import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { Product } from './Tablas/producto.model'; // Importa el modelo
interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public forecasts: WeatherForecast[] = [];

  constructor(private http: HttpClient) {}
  products: Product[] = [];
  cartItems: Product[] = []; // Array para almacenar los productos en el carrito
  showShoppingCartMenu: boolean = false; // Controla la visibilidad del menú del carrito
  currentActiveLink: string = 'Inicio'; // Inicializa 'Inicio' como el enlace activo por defecto
  showSellMenu: boolean = false; // Variable para controlar la visibilidad del menú de venta
  showProductDetailMenu: boolean = false; // Variable para controlar la visibilidad del menú de detalle del producto
  selectedProduct: Product | null = null; // Almacena el producto seleccionado para ver detalles
  showPaymentMenu: boolean = false; // Nueva variable para controlar la visibilidad del menú de pago
  paymentMethod: string = ''; // 'qr', 'card', o vacío
  title = 'pedidosahorita.client';
  ngOnInit(): void {
    // Simulación de productos obtenidos directamente en el frontend
    this.products = [
      { id: 1, name: 'Laptop Ultrabook', description: 'Potente y ligera, ideal para trabajo y estudio.', price: 1200.00 },
      { id: 2, name: 'Auriculares Inalámbricos', description: 'Sonido de alta fidelidad con cancelación de ruido.', price: 150.00 },
      { id: 3, name: 'Smartphone Pro Max', description: 'Cámara avanzada y rendimiento excepcional.', price: 999.99 },
      { id: 4, name: 'Teclado Mecánico RGB', description: 'Experiencia de escritura y juego superior con retroiluminación.', price: 80.00 },
      { id: 5, name: 'Monitor Curvo 27"', description: 'Inmersión total para juegos y productividad.', price: 300.00 },
      { id: 6, name: 'Mouse Gamer Ergonómico', description: 'Precisión y comodidad para largas sesiones de juego.', price: 45.00 },
      { id: 7, name: 'Webcam Full HD', description: 'Ideal para videollamadas y streaming de calidad.', price: 60.00 },
      { id: 8, name: 'Disco Duro SSD 1TB', description: 'Almacenamiento ultrarrápido para todos tus archivos.', price: 110.00 }
    ];
  }

  // Método para añadir un producto al carrito
  addToCart(product: Product): void {
    this.cartItems.push(product);
    console.log('Producto añadido al carrito:', product);
  }

  // Método para quitar un producto del carrito
  removeFromCart(productToRemove: Product): void {
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
    // Si el enlace activo ya es "Carrito", significa que se está haciendo clic para cerrarlo
    // De lo contrario, se abre y se establece "Carrito" como el enlace activo
    if (this.currentActiveLink === 'Carrito') {
      this.showShoppingCartMenu = false;
      this.currentActiveLink = 'Inicio'; // Vuelve a Inicio si se cierra el carrito
    } else {
      this.showShoppingCartMenu = true;
      this.currentActiveLink = 'Carrito'; // Establece Carrito como activo al abrirlo
      this.showSellMenu = false; // Asegura que el menú de venta esté cerrado
      this.showProductDetailMenu = false; // Asegura que el menú de detalle esté cerrado
      this.showPaymentMenu = false; // Asegura que el menú de pago esté cerrado
    }
  }

  // Método para ver los detalles de un producto
  viewProductDetail(product: Product): void {
    this.selectedProduct = product;
    this.currentActiveLink = 'ProductDetail'; // Establece un nuevo estado para los detalles del producto
    this.showProductDetailMenu = true; // Muestra el menú de detalle del producto
    this.showShoppingCartMenu = false; // Oculta el menú del carrito
    this.showSellMenu = false; // Oculta el menú de venta
    this.showPaymentMenu = false; // Oculta el menú de pago
    console.log('Viendo detalles de:', product.name);
  }

  // Método para establecer el enlace de navegación activo
  setActiveLink(linkName: string): void {
    this.currentActiveLink = linkName;

    // Controla la visibilidad de los menús
    this.showShoppingCartMenu = (linkName === 'Carrito');
    this.showSellMenu = (linkName === 'Vender');
    this.showProductDetailMenu = false; // Asegura que el menú de detalle del producto se oculte al cambiar de navegación
    this.showPaymentMenu = false; // Asegura que el menú de pago se oculte al cambiar de navegación
  }

  // Método para simular la subida de un producto (sin funcionalidad por ahora)
  uploadProduct(): void {
    console.log('Botón "Subir Producto" presionado. Aquí iría la lógica de subida.');
    // Lógica para enviar los datos del formulario (futuro)
  }

  // Nuevo método para proceder al menú de pago
  proceedToPayment(): void {
    this.showShoppingCartMenu = false; // Oculta el menú del carrito
    this.showPaymentMenu = true; // Muestra el menú de pago
    this.paymentMethod = ''; // Reinicia el método de pago seleccionado
    this.currentActiveLink = 'Payment'; // Opcional: podrías querer un estado 'Payment' para resaltar el menú de pago si hubiera una navegación directa
    console.log('Procediendo al pago...');
  }

  // Nuevo método para seleccionar el método de pago
  selectPaymentMethod(method: string): void {
    this.paymentMethod = method;
    console.log('Método de pago seleccionado:', method);
  }

  // Nuevo método para procesar el pago (placeholder)
  processPayment(): void {
    console.log('Procesando pago con:', this.paymentMethod);
    // Aquí iría la lógica real de procesamiento de pago
    alert('¡Pago simulado exitoso!'); // Usar una alerta simple por ahora, pero se reemplazaría con un modal.
    this.cartItems = []; // Vacía el carrito después del pago simulado
    this.closePaymentMenu(); // Cierra el menú de pago
    this.setActiveLink('Inicio'); // Vuelve a la página de inicio
  }

  // Nuevo método para cerrar el menú de pago y volver al carrito
  closePaymentMenu(): void {
    this.showPaymentMenu = false;
    this.showShoppingCartMenu = true; // Vuelve al menú del carrito
    this.paymentMethod = ''; // Reinicia el método de pago
    this.currentActiveLink = 'Carrito'; // Establece Carrito como activo
  }
}
