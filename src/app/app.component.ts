import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api-random-letter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  intentos: string[][] = [['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']]; // Arreglo para los intentos
  estados: string[][] = [
    ['', '', '', '', ''], ['', '', '', '', ''],
    ['', '', '', '', ''], ['', '', '', '', ''],
    ['', '', '', '', ''], ['', '', '', '', '']
  ];
  intentoActual: number = 0; // Contador de intentos
  letraActual: number = 0; // Índice de la letra actual
  word = '';
  contador: number = 0;
  intervaloID: any;
  contadorIniciado: boolean = false;
  @ViewChild('time') private time!: ElementRef
  @ViewChild('result') private result!: ElementRef
  @ViewChild('gameContent') private gameContent!: ElementRef
  @ViewChild('textResult') private textResult!: ElementRef
  @ViewChild('wordResult') private wordResult!: ElementRef
  @ViewChild('totalTime') private totalTime!: ElementRef

  constructor(private apiService: ApiService) { }
  ngOnInit(): void {
    // Llamada a la API para obtener datos
    this.apiService.getWord().subscribe(
      response => {
        this.word = response;  // Asignar la respuesta a una propiedad
        console.log(this.word); // Imprimir los datos en la consola
        if (this.word[0].length !== 5) {
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
    this.iniciarContador();
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

        if (palabraIngresada === wordRandom) {
          this.finalizarContador()
          this.result.nativeElement.style.display = "flex"
          this.textResult.nativeElement.textContent = "Felicidades adivino la palabra"
          this.totalTime.nativeElement.style.display = "flex"
          this.totalTime.nativeElement.textContent = `El tiempo total fue: ${this.contador} seg`
          this.gameContent.nativeElement.style.opacity = '0.25'
          return
        }

        if(this.intentos[5].every(celda => celda !== '') && palabraIngresada !== wordRandom)
        {
          this.result.nativeElement.style.display = "flex"
          this.gameContent.nativeElement.style.opacity = '0.25'
          this.textResult.nativeElement.textContent = "La palabra era: "
          this.wordResult.nativeElement.style.display = 'flex'
          return
        }

        this.intentoActual++;
        this.letraActual = 0;
      }
    }

  }

  iniciarContador() {
    if (this.contadorIniciado) return;

    this.contadorIniciado = true
    this.intervaloID = setInterval(() => {
      this.contador++
      this.time.nativeElement.textContent = `Tiempo: ${this.contador}`
    }, 1000);
  }

  finalizarContador() {
    if(this.intervaloID){
      clearInterval(this.intervaloID)
      this.intervaloID = null
      this.contadorIniciado = false
    }
  }

  reiniciarPagina()
  {
    location.reload();
  }
}
