import { AfterViewInit, Component } from '@angular/core'
import { DatatableComponent } from '../../../ngx-datatable/src/lib/components/datatable.component/datatable.component'
import { BehaviorSubject, delay, Observable } from 'rxjs'
import { Tableoptions } from '../../../ngx-datatable/src/lib/models/tableoptions.model'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-root',
  imports: [
    DatatableComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.sass'
})
export class App implements AfterViewInit {
  
  private readonly _data = new BehaviorSubject<any[]>([])
  data$: Observable<any[]> = this._data.asObservable()

  table: Tableoptions = {
    actions: [
      { name: 'delete', icon: 'trash', action: 0 },
      { name: 'edit', icon: 'edit', action: 1 },
      { name: 'show', icon: 'eye', action: 2 }
    ],
    columns: [
      // { id: '1', name: 'id', header: 'ID', cell: 'id', hidden: false, sortable: false },
      { id: '2', name: 'date', header: 'Datum', cell: 'date', pipe: { name: DatePipe, args: 'dd.MM.yyyy HH:mm'}, hidden: false, sortable: true, type: 'datetime-local' },
      { id: '3', name: 'name', header: 'Bezeichnung', cell: 'name', hidden: false, sortable: true },
      // { id: '3', name: 'date', header: 'Date', cell: 'date', pipe: { name: DatePipe, args: 'dd.MM.'}, hidden: false, sortable: true }
    ],
    columnFilter: ['date', 'name'],
    columnNames: ['date', 'name'],
    showCount: true,
    showPaginator: true,
    sortColumn: 'date',
    sortStart: 'asc'
  }

  ngAfterViewInit(): void {
    this._data.next([])
    setTimeout(() => {
      this._data.next([
        { date: new Date(), name: 'John Doe' },
        { date: new Date(), name: 'Jane Smith' },
        { date: new Date(), name: 'Alice Johnson' }
      ])
    }, 1000)
  }
}
