import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";

@NgModule({
    imports: [
        HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule
    ],
    exports: [
        HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule
    ]
})

export class TestingModule {}