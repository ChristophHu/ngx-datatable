import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { DatatableComponent } from '../../../ngx-datatable/src/lib/components/datatable.component/datatable.component'
import { BehaviorSubject, Observable, of, Subject } from 'rxjs'
import { Tableoptions } from '../../../ngx-datatable/src/lib/models/tableoptions.model'
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common'
import { DatatableService } from '../../../ngx-datatable/src/lib/services/datatable.service'
import { ExpandTemplateService } from '../../../ngx-datatable/src/lib/services/expand-template.service'
import { TableActionReturn } from '../../../ngx-datatable/src/lib/models/tableaction.model'
import { TableActionEnum } from '../../../ngx-datatable/src/lib/models/tableaction.enum'
import { IconsComponent } from '@christophhu/ngx-icons'
import { MatMenuModule } from '@angular/material/menu'

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    DatatableComponent,
    IconsComponent,
    JsonPipe,
    MatMenuModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.sass'
})
export class App implements OnInit, OnDestroy, AfterViewInit {
  /**
   * The isVisible property belongs to the data of the dynamic-table.
   * It is used to show or hide the table, depended on the data.
   * 
   * @type {boolean} isVisible - The isVisible property.
   */
  isVisible: boolean = false
  isSpinnerVisible: boolean = true
  isCheckedAll: boolean = false

  @ViewChild('expandtemplate') expandtemplate: any

  private readonly _data = new BehaviorSubject<any[]>([])
  data$: Observable<any[]> = this._data.asObservable()

  destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(private _datatableService: DatatableService, private _expandTemplateService: ExpandTemplateService) {
    this.setData()
  }

  ngAfterViewInit(): void {
    this._expandTemplateService.add('expandtemplate', this.expandtemplate)
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = true
    },2000)
  }

  ngOnDestroy(): void {
    console.log('destroy')
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

  data: any = [
    { id: '1', name: 'Tim', date: '01.01.2024 00:00:59', ort: 'Berlin', checked: false, description: 'Test1' },
    { id: '2', name: 'Tom', date: '01.01.2023 00:00:59', ort: 'Hamburg', checked: false, description: 'Test2' },
    { id: '3', name: 'Thomas', date: '01.02.2023 00:00:59', ort: 'Dresden', checked: false, description: 'Test3' },
    { id: '4', name: 'Martin', date: '03.02.2023 00:00:59', ort: 'München', checked: false, description: 'Halllo1' },
    { id: '5', name: 'Markus', date: '04.02.2023 00:00:59', ort: 'Köln', checked: false, description: 'Hallo2' },
    { id: '6', name: 'Rene', date: '04.02.2023 00:01:59', ort: 'Köln', checked: false, description: 'Hallo2' }
  ]

  // first table - easy table
  easydata$: Observable<any[]> = of([
    { date: '01.01.2024 00:00:59', description: 'Berlin', klar: true },
    { date: '01.01.2023 00:00:59', description: 'Hamburg', klar: false },
  ])
  easytable: Tableoptions = {
    columns: [
      { id: '1', name: 'date', header: 'Datum/Zeit', cell: 'date', pipe: { name: DatePipe, args: 'dd.MM.yyyy HH:mm:ss'}, hidden: false, sortable: true },
      { id: '2', name: 'description', header: 'Beschreibung', cell: 'description', hidden: false, sortable: true },
      { id: '3', name: 'klar', header: 'Klar', cell: 'klar', type: 'checkbox', disabled: true, hidden: false, sortable: true }
    ]
  }

  tableoptions: Tableoptions = {
    actions: [
      { name: 'delete', icon: 'trash', action: 1 },
      { name: 'edit', icon: 'edit', action: 2 },
      { name: 'show', icon: 'eye', action: 4 }
    ],
    columns: [
      { id: '1', name: 'id', header: 'ID', cell: 'id', hidden: true, sortable: true },
      { id: '2', name: 'name', header: 'Name', cell: 'name', hidden: false, sortable: true },
      { id: '3', name: 'date', header: 'Datum/Zeit', cell: 'date', pipe: { name: DatePipe, args: 'dd.MM.yyyy HH:mm:ss'}, hidden: false, sortable: true },
      { id: '4', name: 'ort', header: 'Ort', cell: 'ort', hidden: false, sortable: true },
    ],
    columnFilter: ['name', 'date', 'ort', 'description'],
    columnNames: ['name', 'date', 'ort'],
    isExpandable: true,
    checkbox: false,
    count: false,
    paginator: true,
    sortRowManual: false,
    unread: false,
    sortColumn: 'date',
    sortStart: 'asc'
  }

  /**
   * @param {TableActionReturn} event  The target to process
   * @returns The processed target number
   */
  returnTableAction(event: TableActionReturn) {
    switch (event.action) {
      case TableActionEnum.DELETE:
        this.deleteRow(event.id!)
        break
      case TableActionEnum.EDIT:
        break
      case TableActionEnum.SHOW:
        break
      case TableActionEnum.REFRESH:
        this.setData()
        break
      case TableActionEnum.CHECK:
        break
      case TableActionEnum.CHECKALL:
        this.isCheckedAll = !this.isCheckedAll
        this._data.value.forEach((row: any) => {
          row.checked = this.isCheckedAll
        })
        break
      default:
        console.log('default action')
    }
  }

  /**
   * @ignore
   */
  setData() {
    this._data.next(this.data)
  }

  refreshTable() {
    this._data.next(this.data)
  }

  useExpandTemplate(id: string) {
    let item = this.data.find((el: any) => el.id == id)
    this.data = this.data.filter((el: any) => el.id != id)
    item.checked = true
    this.data = [...this.data, item]
  }

  setTextfilter(filterText: any) {
    this._datatableService.setTextFilter(filterText)
  }
  resetTextfilter() {
    this._datatableService.setTextFilter('')
  }
  deleteRow(id: string) {
    this.data = this.data.filter((el: any) => el.id != id)
    this.setData()
  }
}
