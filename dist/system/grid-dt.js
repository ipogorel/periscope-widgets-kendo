'use strict';

System.register(['periscope-framework', 'jquery', 'datatables.net', 'datatables.net-bs', 'datatables.net-select', 'datatables.net-scroller', 'datatables.net-keytable', 'datatables.net-bs/css/datatables.bootstrap.css!', 'datatables.net-select-bs/css/select.bootstrap.css!', 'datatables.net-keytable-bs/css/keyTable.bootstrap.css!', 'lodash'], function (_export, _context) {
  var Grid, Query, FormatValueConverter, $, factoryDt, factoryDtBs, factoryDtSelect, factoryDtScroller, factoryDtKeytable, _, DT_SELECT_EVENT, DT_DESELECT_EVENT, DT_DRAW_EVENT, DT_DRAW_PAGE, DT_KEYFOCUS_EVENT, DT_KEY_EVENT, GridDT;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_periscopeFramework) {
      Grid = _periscopeFramework.Grid;
      Query = _periscopeFramework.Query;
      FormatValueConverter = _periscopeFramework.FormatValueConverter;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_datatablesNet) {
      factoryDt = _datatablesNet.default;
    }, function (_datatablesNetBs) {
      factoryDtBs = _datatablesNetBs.default;
    }, function (_datatablesNetSelect) {
      factoryDtSelect = _datatablesNetSelect.default;
    }, function (_datatablesNetScroller) {
      factoryDtScroller = _datatablesNetScroller.default;
    }, function (_datatablesNetKeytable) {
      factoryDtKeytable = _datatablesNetKeytable.default;
    }, function (_datatablesNetBsCssDatatablesBootstrapCss) {}, function (_datatablesNetSelectBsCssSelectBootstrapCss) {}, function (_datatablesNetKeytableBsCssKeyTableBootstrapCss) {}, function (_lodash) {
      _ = _lodash;
    }],
    execute: function () {
      DT_SELECT_EVENT = 'select.dt';
      DT_DESELECT_EVENT = 'deselect.dt';
      DT_DRAW_EVENT = 'draw.dt';
      DT_DRAW_PAGE = 'page.dt';
      DT_KEYFOCUS_EVENT = 'key-focus';
      DT_KEY_EVENT = 'key';

      _export('GridDT', GridDT = function (_Grid) {
        _inherits(GridDT, _Grid);

        function GridDT(settings) {
          _classCallCheck(this, GridDT);

          var _this = _possibleConstructorReturn(this, _Grid.call(this, settings));

          _this.selectedColumnIndex = -1;
          _this.initGridLib();
          return _this;
        }

        GridDT.prototype.initGridLib = function initGridLib() {
          var dtObj = factoryDt(undefined, $);
          var dtObjBs = factoryDtBs(undefined, $);
          var dtSelectObj = factoryDtSelect(undefined, $);
          var dtObjKeytable = factoryDtKeytable(undefined, $);
          var dtObjScroller = factoryDtScroller(undefined, $);
        };

        GridDT.prototype.attached = function attached() {
          this.createGrid();
        };

        GridDT.prototype.refresh = function refresh() {
          var _this2 = this;

          _Grid.prototype.refresh.call(this);
          if (!this.dataTable) return;

          if (this.autoGenerateColumns) {
            this.createColumns().then(function () {
              _this2.detached();
              _this2.createGrid();
            });
          } else this.dataTable.draw();
        };

        GridDT.prototype.createGrid = function createGrid() {
          var _this3 = this;

          var me = this;
          this.dataTable = $(this.gridElement).DataTable({
            select: true,
            lengthChange: false,

            scrollY: this._calculateHeight($(this.gridElement)),
            deferRender: true,
            scroller: true,
            paging: true,
            pagingType: "simple",

            processing: true,
            responsive: true,
            order: [],
            filter: false,
            serverSide: true,
            ajax: function ajax(request, drawCallback, settings) {
              if (!me.dataSource) {
                drawCallback({ data: [] });
                return;
              }
              var query = new Query();
              query.take = request.length;
              query.skip = request.start;
              if (request.order.length > 0) {
                query.sort = me.columns[request.order[0].column].field;
                query.sortDir = request.order[0].dir;
              }
              query.serverSideFilter = me.dataFilter;
              me.dataSource.getData(query).then(function (dH) {
                drawCallback({ data: dH.data, recordsTotal: dH.total, recordsFiltered: dH.total });
              }, function (error) {
                drawCallback({ data: [] });
              });
            },
            pageLength: this.pageSize ? this.pageSize : 10,
            keys: this.navigatable,
            columns: !this.columns ? [] : _.map(this.columns, function (c) {
              return {
                data: c.field,
                defaultContent: '',
                title: c.title ? c.title : c.field,
                type: c.format,
                render: c.format ? function (data, type, full, meta) {
                  return FormatValueConverter.format(data, _this3.columns[meta.col].format);
                } : {}
              };
            })
          });
          this.dataTable.on(DT_SELECT_EVENT, function (e, d, t, idx) {
            return _this3.onSelected(idx);
          });
          this.dataTable.on(DT_DESELECT_EVENT, function () {
            return _this3.onDeselected();
          });
          this.dataTable.on(DT_DRAW_EVENT, function () {
            return _this3.handleRedraw();
          });
          this.dataTable.on(DT_KEYFOCUS_EVENT, function () {
            return _this3.onFocus();
          });
          this.dataTable.on(DT_DRAW_PAGE, function () {
            return _this3.onPageChanged();
          });
          this.dataTable.on(DT_KEY_EVENT, function (e, datatable, key, cell, originalEvent) {
            return _this3.onKeyPressed(key, cell);
          });

          $(this.gridElement).find("tbody").on('dblclick', 'tr', function (e) {
            _this3.onActivated($(e.target.parentNode)[0]._DT_RowIndex);
          });
        };

        GridDT.prototype.createColumns = function createColumns() {
          var _this4 = this;

          return this.dataSource.transport.readService.getSchema().then(function (schema) {
            _this4.columns = _.map(schema.fields, function (f) {
              return { field: f.field };
            });
          });
        };

        GridDT.prototype.handleRedraw = function handleRedraw() {
          this.dataTable.rows().deselect();
        };

        GridDT.prototype.onFocus = function onFocus() {
          var cell = this.dataTable.cell({ focused: true });
          if (this.selectedColumnIndex != cell.index().column) {
            this.selectedColumnIndex = cell.index().column;
            if (this.columns[this.selectedColumnIndex].selectable) {
              this.dataTable.column(this.columns[this.selectedColumnIndex].field).select();
              this.dataFieldSelected.raise(this.columns[this.selectedColumnIndex].field);
            }
          }
        };

        GridDT.prototype.onDeselected = function onDeselected() {};

        GridDT.prototype.onSelected = function onSelected(idx) {
          this.dataSelected.raise(this.dataTable.rows(idx).data()[0]);
        };

        GridDT.prototype.onActivated = function onActivated(idx) {
          this.dataActivated.raise(this.dataTable.rows(idx).data()[0]);
        };

        GridDT.prototype.onPageChanged = function onPageChanged() {
          var info = this.dataTable.page.info();
        };

        GridDT.prototype.onKeyPressed = function onKeyPressed(key, cell) {
          if (key === 13) {
            this.dataTable.rows('.selected').deselect();
            this.dataTable.row(cell.index().row).select();
          }
        };

        GridDT.prototype.detached = function detached() {
          this.dataTable.off(DT_SELECT_EVENT);
          this.dataTable.off(DT_DESELECT_EVENT);
          this.dataTable.off(DT_DRAW_EVENT);
          this.dataTable.destroy();
        };

        return GridDT;
      }(Grid));

      _export('GridDT', GridDT);
    }
  };
});