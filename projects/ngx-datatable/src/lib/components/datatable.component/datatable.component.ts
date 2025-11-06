import { AfterViewInit, Component, Input, ViewChild } from '@angular/core'
import { AsyncPipe, JsonPipe, NgClass } from '@angular/common'
import { IconsComponent } from '@christophhu/ngx-icons'
import { MatMenuModule } from '@angular/material/menu'
import { MatSort, MatSortable, MatSortModule } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { BehaviorSubject, Observable } from 'rxjs'
import { Tableoptions } from '../../models/tableoptions.model'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { DynamicPipe } from '../../pipes/dynamic/dynamic.pipe'

@Component({
  selector: 'ngx-datatable',
  imports: [
    AsyncPipe,
    DynamicPipe,
    IconsComponent,
    JsonPipe,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgClass
  ],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.sass',
})
export class DatatableComponent implements AfterViewInit {
  @Input() table!: Tableoptions
  @Input() data$!: Observable<any[]>

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator | null
  @ViewChild(MatSort) sort!: MatSort
  
  private readonly _changePaginator = new BehaviorSubject<boolean>(false)
  changePaginator$: Observable<boolean> = this._changePaginator.asObservable()

  dataSource: any

  pageSize: number = 20
  pageSizeOptions: number[] = [5, 10, 15, 20, 50, 100]

  constructor() {
    this.dataSource = new MatTableDataSource([])
  }
  ngAfterViewInit(): void {
    console.log(this.table)
    this.data$.subscribe({
      next: (data: any[]) => {  
        if (data && data.length > 0) {
          setTimeout(() => {
            if (this.table.showPaginator && this.paginator) {
              this.paginator._intl.itemsPerPageLabel = 'Elemente pro Seite'
              this.paginator._intl.nextPageLabel = 'Nächste'
              this.paginator._intl.previousPageLabel = 'Vorherige'
              this.paginator._intl.getRangeLabel = this.getRangeLabel
              this.dataSource.paginator = this.paginator
            }
  
            if (this.table.sortColumn && this.table.sortStart) {
              this.sort.sort(({ id: this.table.sortColumn, start: this.table.sortStart }) as MatSortable)
            }
            this.dataSource.sort = this.sort
            this.dataSource.data = data
  
            this.dataSource.filterPredicate = (data: any, filter: string) => {
              let match: boolean = false
              this.table.columnFilter.forEach((element: string) => {
                match = (match || data[element].trim().toLowerCase().includes(filter)) // fehler, wenn bei klarmeldungen nach "tr" gefiltert wird
              })
              return match
            }
  
            // this._dynamicTableService.textFilter$.subscribe((data) => this.textfilter(data))
          }, 10)
        }
      },
      error(err: any) {
        console.log(err)
      }
    })
  }

  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const of = "von"
    if (length === 0 || pageSize === 0) {
      return "0 " + of + " " + length
    }
    length = Math.max(length, 0)
    const startIndex = page * pageSize > length ? (Math.ceil(length / pageSize) - 1) * pageSize : page * pageSize

    const endIndex = Math.min(startIndex + pageSize, length)
    return startIndex + 1 + " - " + endIndex + " " + of + " " + length
  }

  updatePaginator() {
    this._changePaginator.next(true)
  }

  /**
   * Retry loading data in case of error
   */
  retry(): void {
    // Implement retry logic here
    // For example: reload data, trigger refresh, etc.
    console.log('Retrying data load...');
  }

  isSticky(id: string) {
    const buttonToggleGroup: string[] = ['count', 'name']
    return (buttonToggleGroup || []).indexOf(id) !== -1;
  }
  show(id: string) {
    // fehler
    // let action: ActionEnum = 4
    // this.action.emit({ id, action })
  }
}
