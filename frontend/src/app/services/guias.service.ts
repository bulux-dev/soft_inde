import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import { HttpClient } from '@angular/common/http';
import { driver } from "driver.js";
import 'driver.js/dist/driver.css';
import { environment } from '../../environments/environment';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class GuiasService {

  route: string = '/guias';
  urlAPI: any = environment.panel;

  constructor(
    private rootService: RootService,
    private httpClient: HttpClient
  ) { }

  async getGuias() {
    return await this.rootService.getPanel(this.route);
  }

  async getGuia(id: number) {
    return await this.rootService.getPanel(`${this.route}/${id}`);
  }

  async postGuia(body: any) {
    return await this.rootService.postPanel(this.route, body);
  }

  async putGuia(id: number, body: any) {
    return await this.rootService.putPanel(`${this.route}/${id}`, body);
  }

  async deleteGuia(id: number) {
    return await this.rootService.deletePanel(`${this.route}/${id}`);
  }

  async guia(guia: any) {
    let path = `${this.urlAPI}/public/guias/${guia.slug}.json`;    
    if (guia.modulo_id) {
      path = `${this.urlAPI}/public/guias/m${guia.modulo_id}/${guia.slug}.json`;
    }
    let conf: any = await this.httpClient.get(path).toPromise();
    conf = JSON.parse(JSON.stringify(conf));
    for (let c = 0; c < conf.steps.length; c++) {

      $(conf.steps[c].element).on('click', (step: any) => {
        let tagName = step.target.tagName.toLowerCase();
        // if (`#${$(step.target).attr('id')}` == conf.steps[c].element) {
        //   driverObj.moveNext();          
        // }
        // if (tagName == 'a') {
        //   driverObj.moveNext();          
        // }
      });

      conf.steps[c].popover.onNextClick = async (step: any) => {
        step.click();
        setTimeout(() => {
          driverObj.moveNext();
          $(`#${conf.steps[c].element}`).addClass('disabled');
        }, 500);
      }
      // conf.steps[c].popover.onPrevClick = async (step: any) => {
      //   step.click();
      //   setTimeout(() => {
      //     driverObj.movePrevious();
      //   }, 1000);
      // }
    }
    // conf.onDestroyStarted = () => {
    //   if (!driverObj.hasNextStep() || confirm("Are you sure?")) {
    //     driverObj.destroy();
    //   }
    // };
    // conf.showButtons = {};
    const driverObj = driver(conf);
    driverObj.drive();
  }

}
