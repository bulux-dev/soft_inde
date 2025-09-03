// Datatable
if ($('.datanew').length > 0) {
  $('.datanew').DataTable({
    "bFilter": true,
    "sDom": 'fBtlpi',
    'pagingType': 'numbers',
    "ordering": true,
    "language": {
      search: ' ',
      sLengthMenu: '_MENU_',
      searchPlaceholder: "Buscar...",
      info: "_START_ - _END_ de _TOTAL_ registros",
    },
    initComplete: (settings, json) => {
      $('.dataTables_filter').appendTo('#tableSearch');
      $('.dataTables_filter').appendTo('.search-input');
    },
  });
}


if ($('.datatable').length > 0) {
  $('.datatable').DataTable({
    "bFilter": false
  });
}