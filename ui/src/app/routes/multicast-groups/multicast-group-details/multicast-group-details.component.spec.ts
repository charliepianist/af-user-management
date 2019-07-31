import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { MulticastGroupDetailsComponent } from './multicast-group-details.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { MulticastGroupService } from 'src/app/services/multicast-group.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { MulticastGroup } from 'src/app/model/multicast-group';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Product } from 'src/app/model/product';

describe('MulticastGroupDetailsComponent', () => {
  let component: MulticastGroupDetailsComponent;
  let fixture: ComponentFixture<MulticastGroupDetailsComponent>;
  let injector: TestBed;
  let service: MulticastGroupService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MulticastGroupDetailsComponent, 
        DeleteConfirmationComponent],
      imports: [
        TestingModule
      ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          paramMap: new Observable( subscriber =>
            subscriber.next({
              get: (field: string) => {
                return 3;
              }
            })
          )
        }
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    service = injector.get(MulticastGroupService);
    httpMock = injector.get(HttpTestingController);

    fixture = TestBed.createComponent(MulticastGroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have no multicast group object on error', () => {
    const req = httpMock.expectOne(`${MulticastGroupService.BASE_URL}/3`);
    req.error(new ErrorEvent('Network error'));
    
    expect(component.multicastGroup).toBeFalsy();
  });

  it('should sort products', () => {
    const req = httpMock.expectOne(`${MulticastGroupService.BASE_URL}/3`);
    req.flush(new MulticastGroup(1, "Test", "Group_TEST", "192.168.15.234", 40, false));
    const req2 = httpMock.expectOne(`${MulticastGroupService.BASE_URL}/3/products`);
    req2.flush([
      new Product(10, "B Product"),
      new Product(20, "A Product")
    ]);

    expect(component.products[0].getName()).toBe("A Product");
    expect(component.products[1].getName()).toBe("B Product");
  })

  it('should call multicastGroupService.deleteMulticastGroup() on delete', () => {
    let multicastGroup = new MulticastGroup(3, 'name');
    component.multicastGroup = multicastGroup;

    spyOn(service, 'deleteMulticastGroup');
    component.deleteMulticastGroup();
    expect(service.deleteMulticastGroup).toHaveBeenCalled();
  });
});
