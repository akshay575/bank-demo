import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isSuccess: boolean = false;
  isSubmit: boolean = false;
  txnMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit(form) {
    console.log(form.value);
    this.isSubmit = true;
    this.http.post('http://localhost:4050/api/makeTransaction', form.value)
      .subscribe((data) => {
        console.log(data);

        console.log(data.status)
        this.isSuccess = data.status === undefined ? false : true;
        this.txnMessage = this.isSuccess ? 'Transaction Successful!' : 'Transaction Failed!';
        console.log(this.isSuccess, this.txnMessage);
        form.reset();
      });
  }

}
