import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

@NgModule({
    imports: [
        HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule,
    ],
    exports: [
        HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule,
    ]
})

export class TestingModule {}