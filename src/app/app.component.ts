import { Component, OnInit, ViewChild } from '@angular/core';
import { PushNotificationsService } from 'ng-push-ivy';
import { WebsocketService } from './shared/services/websocket.service';
import { NotificationService } from './shared/services/notification.service';
import { AppNotification } from './shared/model/app-notification';
import {HttpClient} from '@angular/common/http'
import { forkJoin, Observable } from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

const icon = new Map([
  ['info', 'assets/bell-info.png'],
  ['warn', 'assets/bell-warning.png']
]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Find Your Budget In Real Time!';
  counter: number;
  msg : string;
  bna = [];
  clients = [];
  displayedColumns: string[] = ['id','type','client','projectId','content'];
  dataSource!: MatTableDataSource<any>;
  
 
  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
   
  constructor(private pushNotifications: PushNotificationsService,
              private notificationService: NotificationService,
              private websocketService: WebsocketService,
              private httpClient: HttpClient) {
    this.pushNotifications.requestPermission();
    this.counter = 0;
    this.msg = null;
              
}


getNotifBNA():void{
  this.httpClient.get<any>("http://localhost:8084/notifications/notBNA").subscribe(
    (res) =>{
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }
  );
}
getNotifUIB():void{
  this.httpClient.get<any>("http://localhost:8084/notifications/notUIB").subscribe(
    (res) =>{
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }
  );
}
getNotifBIAT():void{
  this.httpClient.get<any>("http://localhost:8084/notifications/notBIAT").subscribe(
    (res) =>{
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }
  );
}
getNotifQNB():void{
  this.httpClient.get<any>("http://localhost:8084/notifications/notQNB").subscribe(
    (res) =>{
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }
  );
}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
isDisplay = true;
toggleDislpay(){
  this.isDisplay = !this.isDisplay;
}
isDisplay1 = true;
toggleDislpay1(){
  this.isDisplay1 = !this.isDisplay1;
  this.getNotifBNA();
}
isDisplay2 = true;
toggleDislpay2(){
  this.isDisplay2 = !this.isDisplay2;
  this.getNotifBIAT();
}
isDisplay3 = true;
toggleDislpay3(){
  this.isDisplay3 = !this.isDisplay3;
  this.getNotifUIB();
}
isDisplay4 = true;
toggleDislpay4(){
  this.isDisplay4 = !this.isDisplay4;
  this.getNotifQNB();
}

ngOnInit() {
  
  
  
  this.connect();
}
connect(): void {
  this.websocketService.connect();

  // subscribe receives the value.
  this.notificationService.notificationMessage.subscribe((data) => {
    console.log('receive message', data);
    this.notify(data);

    
  });
  
}

disconnect(): void {
  this.websocketService.disconnect();
}

notify(message: AppNotification): void {
  
 this.counter++;
 
  this.msg= message.content;
  
  
  const options = {
    body: message.content,
    icon: icon.get(message.type.toLowerCase())
  };
  this.pushNotifications.create('New Alert', options).subscribe(
    res => console.log(res),
    err => console.log(err)
  );

}

}