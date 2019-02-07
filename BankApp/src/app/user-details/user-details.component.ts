import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  users: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('http://localhost:4050/api/getUsers')
      .subscribe((users) => {
        console.log(users);
        this.users = users;
      })
  }

}
