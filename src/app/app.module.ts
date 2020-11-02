import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createCustomElement } from '@angular/elements';
import {CKEditorModule} from 'ckeditor4-angular';
import { DtsComponent } from './dts/dts.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {TemplateEditorComponent} from './dts/template-editor/template-editor.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    DtsComponent,
    TemplateEditorComponent
  ],
  imports: [
    BrowserModule,
    CKEditorModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    NgxDatatableModule,
    HttpClientModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatDialogModule
  ],
  providers: [
    HttpClient
  ],
  bootstrap: []
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    const el = createCustomElement(DtsComponent, { injector: this.injector });
    if (!customElements.get('app-dts')) {
      customElements.define('app-dts', el);
    }
  }
}
