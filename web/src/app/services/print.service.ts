import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private httpClient: HttpClient) { }

  print(content: any): Promise<any> {
    return this.httpClient.get(`http://192.168.0.150/prt_test.htm?content=${content}&Send=+Print+Test+`).toPromise();
  }

}
