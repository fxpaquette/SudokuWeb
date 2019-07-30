import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconModule } from '@angular/material';
import {MatGridListModule} from '@angular/material/grid-list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImportImageComponent } from './import-image/import-image.component';
import {NumbersOCRModule} from './numbers-ocr/numbers-ocr.module';
import { HttpClientModule} from '@angular/common/http';
import {ImageToArrayModule} from './image-to-array/image-to-array.module';
import {NumbersOCRService} from './numbers-ocr/numbers-ocr.service';

@NgModule({
  declarations: [
    AppComponent,
    ImportImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatGridListModule,
    NumbersOCRModule,
    ImageToArrayModule,
    HttpClientModule
  ],
  providers: [NumbersOCRService],
  bootstrap: [AppComponent]
})
export class AppModule { }
