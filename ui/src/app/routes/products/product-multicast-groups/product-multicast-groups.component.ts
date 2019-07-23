import { Component, OnInit, Input } from '@angular/core';
import { MulticastGroupService } from 'src/app/services/multicast-group.service';
import { MulticastGroup } from 'src/app/model/multicast-group';

@Component({
  selector: 'app-product-multicast-groups',
  templateUrl: './product-multicast-groups.component.html',
  styleUrls: ['./product-multicast-groups.component.css']
})
export class ProductMulticastGroupsComponent implements OnInit {

  @Input() update: boolean;
  initialGroups: MulticastGroup[];
  multicastGroups: MulticastGroup[];
  selected: boolean[] = [];
  allChecked: boolean = false;

  constructor(private multicastGroupService: MulticastGroupService) { }

  ngOnInit() {
    this.multicastGroupService.listMulticastGroups(
      p => {
        this.multicastGroups = p.content;
        this.processGroups();
      },
      e => {
        alert('Could not load multicast groups, see console for details.');
        console.log(e);
      },
      {sortBy: "name", size: 500}
    )
  }

  toggleAllGroups() {
    this.allChecked = !this.allChecked;
    for(let i = 0; i < this.multicastGroups.length; i++) {
      this.selected[i] = this.allChecked;
    }
  }

  toggleGroup(i: number) {
    if(this.update) this.selected[i] = !this.selected[i];
  }

  groupIsSelected(i: number): boolean {
    return this.selected[i];
  }

  useGroups(groups: MulticastGroup[]) {
    this.initialGroups = groups;
    this.processGroups();
  }

  processGroups() {
    if(this.initialGroups && this.multicastGroups) {
      for(let i = 0; i < this.multicastGroups.length; i++) {
        if(this.initialGroups.some(
          (group: MulticastGroup) => {
            return group.getId() === this.multicastGroups[i].getId()
          }
        )) {
          this.selected[i] = true;
        }
      }
    }
  }

  getSelectedGroups(): MulticastGroup[] {
    let arr = [];
    for(let i = 0; i < this.selected.length; i++) {
      if(this.selected[i]) arr.push(this.multicastGroups[i]);
    }
    return arr;
  }
}
