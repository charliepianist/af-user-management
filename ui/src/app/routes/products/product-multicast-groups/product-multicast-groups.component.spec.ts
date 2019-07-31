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
      new MulticastGroup(1, 'name 1', 'Group_CODE_ONE', '122.122.2.2', 4000, true),
      new MulticastGroup(2, 'name 2', 'Group_CODE_TWO', '122.124.5.62', 4044),
      new MulticastGroup(3, 'name 3', 'Group_CODE_THREE', '122.124.5.62', 4045)
    ];

    component.multicastGroups = groups;
    component.update = true;
    component.useGroups([groups[0], groups[2]]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct multicast group', () => {
    expect(component.initialGroups.length).toBeLessThanOrEqual(2);
    expect(component.initialGroups[0].getName() === 'name 3' ||
        component.initialGroups[1].getName() === 'name 3').toBe(true);
  });

  it('should return correct getSelectedGroups() (should not include auto-assigned group(s))', () => {
    component.toggleGroup(1);
    component.toggleGroup(2);

    let selectedGroups = component.getSelectedGroups();
    expect(selectedGroups.length).toBe(1);
    expect(selectedGroups[0].getName()).toBe('name 2');
  });
});