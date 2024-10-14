import { Component, OnInit,HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api-random-letter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  intentos: string[][] = [ ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''] ]; // Arreglo para los intentos
  intentoActual: number = 0; // Contador de intentos
  letraActual: number = 0; // Índice de la letra actual
  word = '';

  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    // Llamada a la API para obtener datos
    this.apiService.getWord().subscribe(
      response => {
        this.word = response;  // Asignar la respuesta a una propiedad
        console.log(this.word); // Imprimir los datos en la consola
      },
      error => {
        console.error('Error al obtener datos:', error); // Manejar errores
      }
    )
  }

  // Captura las teclas presionadas
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Solo procesar si hay espacio en el intento actual
    if (this.intentoActual < 6) {
      const letra = event.key.toUpperCase();

      // Si se presiona la tecla Backspace, eliminar la última letra
      if (event.key === 'Backspace') {
        if (this.letraActual > 0) {
          this.letraActual--; // Decrementar el índice de la letra actual
          this.intentos[this.intentoActual][this.letraActual] = ''; // Borrar la letra
        }
      } else if (letra.length === 1 && /^[A-Z]$/.test(letra)) {
        // Validar que la tecla presionada sea una letra
        this.intentos[this.intentoActual][this.letraActual] = letra;
        this.letraActual++;
      }

      // Si se han ingresado 5 letras, reiniciar la letraActual y aumentar el intento
      if (this.letraActual === 5) {
        this.letraActual = 0;
        const palabraIngresada = this.intentos[this.intentoActual].join('').toLowerCase()
        if(palabraIngresada === this.word[0]){
          console.log("Ingresaste la palabra correcta")
        } else
        {
          console.log("No es la correcta")
        }
        this.intentoActual++;
      }
    }
  }
}
