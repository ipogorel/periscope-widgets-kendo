define(['exports', 'periscope-framework', 'jquery', 'datatables.net', 'datatables.net-bs', 'datatables.net-select', 'datatables.net-scroller', 'datatables.net-keytable', 'lodash', 'datatables.net-bs/css/datatables.bootstrap.css!', 'datatables.net-select-bs/css/select.bootstrap.css!', 'datatables.net-keytable-bs/css/keyTable.bootstrap.css!'], function (exports, _periscopeFramework, _jquery, _datatables, _datatables3, _datatables5, _datatables7, _datatables9, _lodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.GridDT = undefined;

  var _jquery2 = _interopRequireDefault(_jquery);

  var _datatables2 = _interopRequireDefault(_datatables);

  var _datatables4 = _interopRequireDefault(_datatables3);

  var _datatables6 = _interopRequireDefault(_datatables5);

  var _datatables8 = _interopRequireDefault(_datatables7);

  var _datatables10 = _interopRequireDefault(_datatables9);

  var _ = _interopRequireWildcard(_lodash);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  var DT_SELECT_EVENT = 'select.dt';
  var DT_DESELECT_EVENT = 'deselect.dt';
  var DT_DRAW_EVENT = 'draw.dt';
  var DT_DRAW_PAGE = 'page.dt';
  var DT_KEYFOCUS_EVENT = 'key-focus';
  var DT_KEY_EVENT = 'key';

  var GridDT = exports.GridDT = function (_Grid) {
    _inherits(GridDT, _Grid);

    function GridDT(settings) {
      _classCallCheck(this, GridDT);

      var _this = _possibleConstructorReturn(this, _Grid.call(this, settings));

      _this.selectedColumnIndex = -1;
      _this.initGridLib();
      return _this;
    }

    GridDT.prototype.initGridLib = function initGridLib() {
      var dtObj = (0, _datatables2.default)(undefined, _jquery2.default);
      var dtObjBs = (0, _datatables4.default)(undefined, _jquery2.default);
      var dtSelectObj = (0, _datatables6.default)(undefined, _jquery2.default);
      var dtObjKeytable = (0, _datatables10.default)(undefined, _jquery2.default);
      var dtObjScroller = (0, _datatables8.default)(undefined, _jquery2.default);
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
      this.dataTable = (0, _jquery2.default)(this.gridElement).DataTable({
        select: true,
        lengthChange: false,

        scrollY: this._calculateHeight((0, _jquery2.default)(this.gridElement)),
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
          var query = new _periscopeFramework.Query();
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
              return _periscopeFramework.FormatValueConverter.format(data, _this3.columns[meta.col].format);
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

      (0, _jquery2.default)(this.gridElement).find("tbody").on('dblclick', 'tr', function (e) {
        _this3.onActivated((0, _jquery2.default)(e.target.parentNode)[0]._DT_RowIndex);
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
  }(_periscopeFramework.Grid);
});