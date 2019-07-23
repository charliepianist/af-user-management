import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMulticastGroupsComponent } from './product-multicast-groups.component';
import { TestingModule } from 'src/app/test/TestingModule';
import { MulticastGroup } from 'src/app/model/multicast-group';
import { MulticastGroupService } from 'src/app/services/multicast-group.service';


describe('ProductMulticastGroupsComponent', () => {
  let component: ProductMulticastGroupsComponent;
  let fixture: ComponentFixture<ProductMulticastGroupsComponent>;
  let groups: MulticastGroup[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMulticastGroupsComponent ],
      imports: [ TestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMulticastGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    //Setup
    groups = [
      new MulticastGroup(1, 'name 1', '122.122.2.2', 4000),
      new MulticastGroup(2, 'name 2', '122.124.5.62', 4044)
    ];

    component.multicastGroups = groups;
    component.update = true;
    component.useGroups(groups);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct multicast groups', () => {
    expect(component.initialGroups.length).toBe(2);
    expect(component.initialGroups[0].getName()).toBe('name 1');
    expect(component.initialGroups[1].getName()).toBe('name 2');
  });

  it('should return correct getSelectedGroups()', () => {
    component.toggleGroup(0);

    let selectedGroups = component.getSelectedGroups();
    expect(selectedGroups.length).toBe(1);
    expect(selectedGroups[0].getName()).toBe('name 2');
  });
});