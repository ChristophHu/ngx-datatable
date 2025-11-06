export interface Column {
    id          : string,
    name        : string,
    header      : string,
    cell        : string,
    hidden      : boolean,
    sortable    : boolean,
    editable?   : boolean,
    disabled?   : boolean,
    pipe?       : { name: any, args: any },
    textsize?   : string,
    type?       : 'checkbox' | 'datetime-local'
}