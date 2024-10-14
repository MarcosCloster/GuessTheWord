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
  estados: string[][] = [
    ['', '', '', '', ''], ['', '', '', '', ''], 
    ['', '', '', '', ''], ['', '', '', '', ''], 
    ['', '', '', '', ''], ['', '', '', '', '']
  ];
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
        if(this.word[0].length !== 5){
          location.reload()
        }
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
      if (this.letraActual < 5) {
        this.intentos[this.intentoActual][this.letraActual] = letra;
        this.letraActual++;
      }
    }

    // Si se han ingresado 5 letras y se presiona Enter
    if (event.key === 'Enter' && this.letraActual === 5) {
      const palabraIngresada = this.intentos[this.intentoActual].join('').toLowerCase();
      const wordRandom = this.word[0].toLowerCase();

      // Contar la cantidad de veces que aparece cada letra en la palabra aleatoria
      const letrasDisponibles: { [key: string]: number } = {};
      for (let letra of wordRandom) {
        letrasDisponibles[letra] = (letrasDisponibles[letra] || 0) + 1;
      }

      // Primero marcamos las letras correctas (verdes)
      for (let i = 0; i < 5; i++) {
        const letraIngresada = palabraIngresada[i];
        if (letraIngresada === wordRandom[i]) {
          this.estados[this.intentoActual][i] = 'correcta';  // Letra en la posición correcta
          letrasDisponibles[letraIngresada]--; // Reducimos la disponibilidad de esa letra
        }
      }

      // Luego marcamos las letras presentes (amarillas)
      for (let i = 0; i < 5; i++) {
        const letraIngresada = palabraIngresada[i];
        if (this.estados[this.intentoActual][i] !== 'correcta' && wordRandom.includes(letraIngresada) && letrasDisponibles[letraIngresada] > 0) {
          this.estados[this.intentoActual][i] = 'presente';  // Letra en la palabra pero en otra posición
          letrasDisponibles[letraIngresada]--; // Reducimos la disponibilidad de esa letra
        } else if (this.estados[this.intentoActual][i] !== 'correcta') {
          this.estados[this.intentoActual][i] = 'incorrecta';  // Letra no está en la palabra
        }
      }

      this.intentoActual++;
      this.letraActual = 0;
    }
  }
}

}
