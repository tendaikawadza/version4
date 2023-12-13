import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Token } from "@angular/compiler";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, observable, Subscription } from "rxjs";






import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { Stock } from "../model/stock";


const baseUrl = `${environment.apiUrl}/products`;

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private host=environment.apiUrl;
  private stockURL=environment.stockUrl;

  constructor(private http:HttpClient) {}
   public getStock():Observable<Stock  [] |HttpErrorResponse>{

  return  this.http.get<Stock[]>('${this.host}/stock/list');

   }


   public addStock(formData: FormData): Observable<Stock|HttpErrorResponse>{
    return this.http.post<Stock>('${this.host}/stock/add',formData);

   }
   public updateStock(formData: FormData): Observable<Stock|HttpErrorResponse>{
    return this.http.post<Stock>('${this.host}/stock/update',formData);

   }

   public fetchNotifications(user:any){
    return this.http.post<any>(this.stockURL+'/product/browseNotifications/'+user.receiverId, user);
   }


   public deleteStock(stockId: number): Observable<any|HttpErrorResponse>{
    return this.http.delete<Stock>('${this.host}/stock/delete/${userId}');

   }
   public addProducts(formData: FormData): Observable<Stock|HttpErrorResponse>{
    return this.http.post<Stock>('${this.host}/product/product',formData);

   }
   public addProduct(product:any): Observable<any> {
    let url=`${this.host}/stock/add`;    
    return this.http.post<any>(url,product);
  }
 
  // getAllProducts(){ 
  //   let url=`${this.host}/stock/all`; 
  // return this.http.get<>(url,product);


  // }


  
getAllProducts() {
  const url = `${this.host}/stock/all`;
  return this.http.get<Stock[]>(url);
}
  updateProducts(id: string, params: any) {
    return this.http.put(`${baseUrl}/${id}`, params);
  }
  deleteProduct(id:any){
    let url=`${baseUrl}/${id}`;    
    return this.http.delete<any>(url);
    
   }
   }
  

