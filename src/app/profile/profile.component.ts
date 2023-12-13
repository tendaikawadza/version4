import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, BehaviorSubject, map, startWith, catchError } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { EventType } from 'src/app/enum/event-type.enum';
import { Key } from 'src/app/enum/key.enum';
import { CustomHttpResponse, Profile } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { UserService } from 'src/app/service/user.service';
import { User } from '../model/user';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileState$: Observable<any>;
  singleprofileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<any | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();
  readonly DataState = DataState;
  readonly EventType = EventType;
  user:User | undefined;
  userData:any
  activeTab:any = 'profile';
  userId:any;
  profData:Profile;
  roles= [
    {
        "id": 1,
        "name": "ROLE_USER",
        "permission": "READ:USER,READ:CUSTOMER"
    },
    {
        "id": 10,
        "name": "ROLE_FIN",
        "permission": "READ:USER,READ:CUSTOMER"
    },
    {
        "id": 11,
        "name": "ROLE_STORES",
        "permission": "READ:USER,READ:CUSTOMER"
    }
];
  constructor(private userService: UserService, private messageservice:MessageService, private router:ActivatedRoute) {
  let userData:any = (localStorage.getItem("user"))
  this.userData =JSON.parse(userData)
 
  
   }
   ngOnInit(): void {
    this.userId=this.router.snapshot.paramMap.get('uid');
    console.log(this.userId)
  
    // this.profileState$ = this.userService.profile$()
    //   .pipe(
    //     map(response => {
    //       console.log(response);
    //       this.dataSubject.next(response);
    //       return { dataState: DataState.LOADED, appData: response };
    //     }),
    //     startWith({ dataState: DataState.LOADING }),
    //     catchError((error: string) => {
    //       return of({ dataState: DataState.ERROR, appData: this.dataSubject.value, error })
    //     })
    //   )
  this.profileState$= this.userService.singleProfile$(this.userId)
      .pipe(
        map((response:any) => {
          console.log(response);
          response['roles']=this.roles;
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED, appData: response };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, appData: this.dataSubject.value, error })
        })
      )
  }
  onChange(val:any){
    console.log(val)
    this.activeTab=val;
  }

  updateProfile(profileForm: NgForm): void {
    console.log(profileForm);
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.update$(profileForm.value)
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.LOADED, appData: this.dataSubject.value, error })
        })
      )
  }
  updatePassword(passwordForm: NgForm): void {
    this.isLoadingSubject.next(true);
    if (passwordForm.value.newPassword === passwordForm.value.confirmNewPassword) {
      this.profileState$ = this.userService.updatePassword$(passwordForm.value)
        .pipe(
          map(response => {
            this.messageservice.add({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });

         //   this.notification.onDefault(response.message);
            console.log(response);
            this.dataSubject.next({ ...response, data: response.data });
            passwordForm.reset();
            this.isLoadingSubject.next(false);
            return { dataState: DataState.LOADED, appData: this.dataSubject.value };
          }),
          startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
          catchError((error: string) => {
            this.messageservice.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
            passwordForm.reset();
            this.isLoadingSubject.next(false);
            return of({ dataState: DataState.LOADED, appData: this.dataSubject.value, error })
          })
        )
    } else {
      passwordForm.reset();
      this.isLoadingSubject.next(false);
    }
  }


  updateRole(roleForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.updateRoles$(roleForm.value.roleName)
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.LOADED, appData: this.dataSubject.value, error })
        })
      )
  }

  updateAccountSettings(settingsForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.updateAccountSettings$(settingsForm.value)
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.LOADED, appData: this.dataSubject.value, error })
        })
      )
  }

  toggleMfa(): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.toggleMfa$()
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.LOADED, appData: this.dataSubject.value, error })
        })
      )
  }

  updatePicture(image: File): void {
    if (image) {
      this.isLoadingSubject.next(true);
      this.profileState$ = this.userService.updateImage$(this.getFormData(image))
        .pipe(
          map((response:any) => {
            console.log(response);
            this.dataSubject.next({ ...response, 
              data: { ...response.data, 
                user: { ...response.data.user, imageUrl: `${response.data.user.imageUrl}?time=${new Date().getTime()}`}} });
            this.isLoadingSubject.next(false);
            return { dataState: DataState.LOADED, appData: this.dataSubject.value };
          }),
          startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
          catchError((error: string) => {
            this.isLoadingSubject.next(false);
            return of({ dataState: DataState.LOADED, appData: this.dataSubject.value, error })
          })
        )
    }
  }

  toggleLogs(): void {
    this.showLogsSubject.next(!this.showLogsSubject.value);
  }

  private getFormData(image: File): FormData {
    const formData = new FormData();
    formData.append('image', image);
    return formData;
  }

}
