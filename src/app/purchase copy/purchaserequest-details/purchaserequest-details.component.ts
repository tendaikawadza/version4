import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, BehaviorSubject, switchMap, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse } from 'src/app/interface/appstates';
import { Customer } from 'src/app/interface/customer';
import { Invoice } from 'src/app/interface/invoice';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { CustomerService } from 'src/app/service/customer.service';
import { jsPDF as pdf } from 'jspdf';
import { NotificationService } from 'src/app/service/notification.service';

const INVOICE_ID = 'id';
@Component({
  selector: 'app-purchaserequest-details',
  templateUrl: './purchaserequest-details.component.html',
  styleUrls: ['./purchaserequest-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaserequestDetailsComponent implements OnInit {
  invoiceState$: Observable<State<CustomHttpResponse<Customer & Invoice & User>>>;
  private dataSubject = new BehaviorSubject<any>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;

  constructor(private activatedRoute: ActivatedRoute, private customerService: CustomerService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.invoiceState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: any) => {
        return this.customerService.invoice$(+params.get(INVOICE_ID))
          .pipe(
            map(response => {
            //  this.notification.onDefault(response.message);
              console.log(response);
              this.dataSubject.next(response);
              return { dataState: DataState.LOADED, appData: response };
            }),
            startWith({ dataState: DataState.LOADING }),
            catchError((error: string) => {
             // this.notification.onError(error);
              return of({ dataState: DataState.ERROR, error })
            })
          )
      })
    );
  }

  exportAsPDF(): void {
    const filename = `invoice-${this.dataSubject.value.data['invoice'].invoiceNumber}.pdf`;
    const doc = new pdf();
   // doc.html(document.getElementById('invoice'), { margin: 5, windowWidth: 1000, width: 200, 
     // callback: (invoice) => invoice.save(filename) });
  }

}
