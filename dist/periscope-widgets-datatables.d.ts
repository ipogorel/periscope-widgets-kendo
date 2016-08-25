declare module 'periscope-widgets-datatables' {
  import $ from 'jquery';
  import * as _ from 'lodash';
  import {
    Grid,
    Query,
    FormatValueConverter
  } from 'periscope-framework';
  import factoryDt from 'datatables.net';
  import factoryDtBs from 'datatables.net-bs';
  import factoryDtSelect from 'datatables.net-select';
  import factoryDtScroller from 'datatables.net-scroller';
  import factoryDtKeytable from 'datatables.net-keytable';
  import 'datatables.net-bs/css/datatables.bootstrap.css!';
  import 'datatables.net-select-bs/css/select.bootstrap.css!';
  import 'datatables.net-keytable-bs/css/keyTable.bootstrap.css!';
  export class GridDT extends Grid {
    constructor(settings: any);
    initGridLib(): any;
    attached(): any;
    refresh(): any;
    createGrid(): any;
    createColumns(): any;
    handleRedraw(): any;
    onFocus(): any;
    onDeselected(): any;
    onSelected(idx: any): any;
    onActivated(idx: any): any;
    onPageChanged(): any;
    onKeyPressed(key: any, cell: any): any;
    detached(): any;
  }
  export * from 'periscope-widgets-datatables/grid-dt';
  export function configure(aurelia: any): any;
}