import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http'; // Importa HttpClientModule

import { AppComponent } from './app.component'; // Ajusta la ruta si es necesario

@NgModule({
  declarations: [
    AppComponent,
    // otros componentes
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Asegúrate de agregar esto
    // otros módulos
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }