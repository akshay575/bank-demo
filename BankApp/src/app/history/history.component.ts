import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
declare let google: any;

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  userId: number;
  txns: any;
  debitTxnCount: number = 0;
  creditTxnCount: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.userId = this.route.snapshot.params['userId'];
    this.http.get(`http://localhost:4050/api/getHistory/${this.userId}`)
      .subscribe((data) => {
        console.log(data);
        this.txns = data;

        data.forEach(txn => {
          if(txn.type === "debit") {
            this.debitTxnCount++;
          }
          else {
            this.creditTxnCount++;
          }
        });

        this.loadPieChart();
        this.loadBarChart();
      })
  }

  loadPieChart() {
    let self = this;
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {

      // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Type');
      data.addColumn('number', 'Count');
      data.addRows([
        ['Credit', self.creditTxnCount],
        ['Debit', self.debitTxnCount],
      ]);

      var options = {
        height: 300
      }

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('pie-chart'));
      chart.draw(data, options);
    }
  }

  loadBarChart() {
    let self = this;
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {

      // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Type');
      data.addColumn('number', 'Count');
      data.addRows([
        ['Credit', self.creditTxnCount],
        ['Debit', self.debitTxnCount],
      ]);

      var options = {
        height: 300
      }

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.ColumnChart(document.getElementById('bar-chart'));
      chart.draw(data, options);
    }
  }

}
