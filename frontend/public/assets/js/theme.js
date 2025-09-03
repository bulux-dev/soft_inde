// ToolTip

if ($('[data-bs-toggle="tooltip"]').length > 0) {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
}

var right_side_views = '<div class="right-side-views d-none">' +
  '<ul class="sticky-sidebar siderbar-view">' +
  '<li class="sidebar-icons">' +
  '<a class="toggle tipinfo open-layout open-siderbar" href="javascript:void(0);" data-toggle="tooltip" data-placement="left" data-bs-original-title="Tooltip on left">' +
  '<div class="tooltip-five ">' +
  '<img src="assets/img/icons/siderbar-icon2.svg" class="feather-five" alt="">' +
  '<span class="tooltiptext">Check Layout</span>' +
  '</div>' +
  '</a>' +
  '</li>' +
  '</ul>' +
  '</div>' +

  '<div class="sidebar-layout">' +
  '<div class="sidebar-content">' +
  '<div class="sidebar-top">' +
  '<div class="container-fluid">' +
  '<div class="row align-items-center">' +
  '<div class="col-xl-6 col-sm-6 col-12">' +
  '<div class="sidebar-logo">' +
  '<a href="index" class="logo">' +
  '<img src="assets/img/logo.png" alt="Logo" class="img-flex">' +
  '</a>' +
  '</div>' +
  '</div>' +
  '<div class="col-xl-6 col-sm-6 col-12">' +
  '<a class="btn-closed" href="javascript:void(0);"><img class="img-fliud" src="assets/img/icons/sidebar-delete-icon.svg" alt="demo"></a>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '<div class="container-fluid">' +
  '<div class="row align-items-center">' +
  '<h5 class="sidebar-title">Choose layout</h5>' +
  '<div class="col-xl-12 col-sm-6 col-12">' +
  '<div class="sidebar-image align-center">' +
  '<img class="img-fliud" src="assets/img/demo-one.png" alt="demo">' +
  '</div>' +
  '<div class="row">' +
  '<div class="col-lg-6 layout">' +
  '<h5 class="layout-title">Dark Mode</h5>' +
  '</div>' +
  '<div class="col-lg-6 layout dark-mode">' +
  '<label class="toggle-switch" for="notification_switch3">' +
  '<span>' +
  '<input type="checkbox" class="toggle-switch-input" id="notification_switch3">' +
  '<span class="toggle-switch-label ms-auto">' +
  '	<span class="toggle-switch-indicator"></span>' +
  '</span>' +
  '</span>' +
  ' </label>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '</div>' +
  $("body").append(right_side_views);

// Sidebar Visible

$('.open-layout').on("click", function (s) {
  s.preventDefault();
  $('.sidebar-layout').addClass('show-layout');
  $('.sidebar-settings').removeClass('show-settings');
});
$('.btn-closed').on("click", function (s) {
  s.preventDefault();
  $('.sidebar-layout').removeClass('show-layout');
});
$('.open-settings').on("click", function (s) {
  s.preventDefault();
  $('.sidebar-settings').addClass('show-settings');
  $('.sidebar-layout').removeClass('show-layout');
});

$('.btn-closed').on("click", function (s) {
  s.preventDefault();
  $('.sidebar-settings').removeClass('show-settings');
});

$('.open-siderbar').on("click", function (s) {
  s.preventDefault();
  $('.siderbar-view').addClass('show-sidebar');
});

$('.btn-closed').on("click", function (s) {
  s.preventDefault();
  $('.siderbar-view').removeClass('show-sidebar');
});

if ($('.toggle-switch').length > 0) {
  const toggleSwitch = document.querySelector('.toggle-switch input[type="checkbox"]');
  const currentTheme = localStorage.getItem('theme');
  var app = document.getElementsByTagName("BODY")[0];

  if (currentTheme) {
    app.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
      toggleSwitch.checked = true;
    }
  }

  function switchTheme(e) {
    if (e.target.checked) {
      app.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    else {
      app.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleSwitch.addEventListener('change', switchTheme, false);
}

if (window.location.hash == "#LightMode") {
  localStorage.setItem('theme', 'dark');
}
else {
  if (window.location.hash == "#DarkMode") {
    localStorage.setItem('theme', 'light');
  }
}


$('ul.tabs li').click(function () {
  var $this = $(this);
  var $theTab = $(this).attr('id');
  console.log($theTab);
  if ($this.hasClass('active')) {
    // do nothing
  } else {
    $this.closest('.tabs_wrapper').find('ul.tabs li, .tabs_container .tab_content').removeClass('active');
    $('.tabs_container .tab_content[data-tab="' + $theTab + '"], ul.tabs li[id="' + $theTab + '"]').addClass('active');
  }

});

$('.add-setting').on("click", function (e) {
  e.preventDefault();
  $('.preview-toggle.sidebar-settings').addClass('show-settings');
});
$('.sidebar-close').on("click", function (e) {
  e.preventDefault();
  $('.preview-toggle.sidebar-settings').removeClass('show-settings');
});
$('.navigation-add').on("click", function (e) {
  e.preventDefault();
  $('.nav-toggle.sidebar-settings').addClass('show-settings');
});
$('.sidebar-close').on("click", function (e) {
  e.preventDefault();
  $('.nav-toggle.sidebar-settings').removeClass('show-settings');
});

// DarkMode with LocalStorage
if ($('#dark-mode-toggle').length > 0) {
  $("#dark-mode-toggle").children(".light-mode").addClass("active");
  let darkMode = localStorage.getItem('darkMode');

  const darkModeToggle = document.querySelector('#dark-mode-toggle');

  const enableDarkMode = () => {
    document.body.setAttribute('data-theme', 'dark');
    $("#dark-mode-toggle").children(".dark-mode").addClass("active");
    $("#dark-mode-toggle").children(".light-mode").removeClass("active");
    localStorage.setItem('darkMode', 'enabled');
  }

  const disableDarkMode = () => {
    document.body.removeAttribute('data-theme', 'dark');
    $("#dark-mode-toggle").children(".dark-mode").removeClass("active");
    $("#dark-mode-toggle").children(".light-mode").addClass("active");
    localStorage.setItem('darkMode', null);
  }

  if (darkMode === 'enabled') {
    enableDarkMode();
  }

  darkModeToggle.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkMode');

    if (darkMode !== 'enabled') {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  });
}