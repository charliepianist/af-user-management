import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MulticastGroupService } from 'src/app/services/multicast-group.service';
import { MulticastGroup } from 'src/app/model/multicast-group';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-multicast-group-form',
  templateUrl: './multicast-group-form.component.html',
  styleUrls: ['./multicast-group-form.component.css']
})
export class MulticastGroupFormComponent implements OnInit {

  id: string; // null if invalid ID or no ID passed in
  idNum: number = null; 
  errorMsg: string = null;
  multicastGroup: MulticastGroup = new MulticastGroup();
  origName: string = null;
  name: string = null;
  code: string = null;
  ip: string = null;
  port: number = null;
  autoAssign: boolean = false;
  invalidSubmit: boolean = false; // when submit clicked with invalid input
  submissionErrorMsg: string = null;

  constructor(private router: Router, private route: ActivatedRoute, private multicastGroupService: MulticastGroupService) {}

  ngOnInit() {
    let errorFunc = (e: HttpErrorResponse) => {
      this.errorMsg = e.message; 
      console.log(e);
    };
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
        if(this.isUpdating()) this.multicastGroupService.getMulticastGroup(this.id, 
          p => {
            this.multicastGroup = p
            this.idNum = this.multicastGroup.getId();
            this.origName = this.multicastGroup.getName();
            this.name = this.origName;
            this.code = this.multicastGroup.getCode();
            this.ip = this.multicastGroup.getIp();
            this.port = this.multicastGroup.getPort();
            this.autoAssign = this.multicastGroup.isAutoAssign();
          },
          e => { 
            this.id = null; 
            errorFunc(e);
          });
      },
      errorFunc);
  }

  validateName(): string {
    if(!this.name) return 'Please enter a name.';
    if(this.name.length > 255) return 'Name cannot be over 255 characters long.'
    return null;
  }
  validateCode(): string {
    if(!this.code) return 'Please enter a code.';
    if(this.code.length > 255) return 'Code cannot be over 255 characters long.'
    if(this.code.match('\\s')) return 'Code cannot have whitespace.'
    return null;
  }
  validateIp(): string {
    if(!this.ip) return 'Please enter an IP.';
    if(!this.ip.match('^([0-9]{1,3}\\.){3}[0-9]{1,3}$'))
      return 'Invalid IP format. (e.g. 192.168.1.1)';
    
    let nums = this.ip.split('.');
    for(let i = 0; i < nums.length; i++) {
      if(nums[i].substring(0, 1) === '0' && nums[i].length > 1) return 'IP numbers should not have leading zeroes.'
      if(parseInt(nums[i]) > 255) return 'IP numbers must be between 0 and 255. (e.g. 192.168.1.1)';
    }
    return null;
  }
  validatePort(): string {
    if(!this.port) return 'Please enter a port.';
    if(isNaN(this.port)) return 'Port must be a number.';
    if(this.port % 1 !== 0) return 'Port must be an integer.'
    if(this.port < 0 || this.port > 65535) 
      return 'Port must be between 0 and 65535.';
    return null;
  }

  isUpdating(): boolean {
    if(this.id) return true;
    return false;
  }
  
  submitButton() {
    if(this.validateName() || this.validateCode() || this.validateIp() || this.validatePort()) {
      this.invalidSubmit = true;
    }else {
      let newMulticastGroup = new MulticastGroup(
        this.idNum, 
        this.name,
        this.code,
        this.ip,
        this.port,
        this.autoAssign);

      let successFunc = (group: MulticastGroup) => {
        this.router.navigate(['/multicast-groups', group.getId()]);
      };
      let errorFunc = (e: HttpErrorResponse) => {
        this.submissionErrorMsg = e.error.status + ' ' + 
                                  e.error.error + ': ' +
                                  e.error.message;
        console.log(e);
      }
      if(this.isUpdating()) {
        // Updating an already existing multicastGroup without entitlements
        this.multicastGroupService.updateMulticastGroup(newMulticastGroup, successFunc, 
          errorFunc);
      }else {
        // Creating a new multicastGroup without entitlements
        this.multicastGroupService.createMulticastGroup(newMulticastGroup, successFunc,
          errorFunc);
      }
    }
  }

  cancelButton() {
    if(this.isUpdating()) {
      this.router.navigate(['/multicast-groups', this.multicastGroup.getId()]);
    }else this.router.navigate(['/multicast-groups']);
  }
}
