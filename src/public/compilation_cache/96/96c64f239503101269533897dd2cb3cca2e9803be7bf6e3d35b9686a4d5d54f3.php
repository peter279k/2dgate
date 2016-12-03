<?php

/* index.html */
class __TwigTemplate_8fb8c37c78d96153c4d790dd89119612e7e685e76f47c1caae97b160c343e0da extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<!DOCTYPE html>
<html>
  <head>
    <!-- Required meta tags-->
    <meta charset=\"utf-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui\">
    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">
    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\">
    <!-- Your app title -->
    <title>二次元之門-手機板</title>
    <!-- Path to Framework7 iOS CSS theme styles-->
    <link rel=\"stylesheet\" href=\"path/to/framework7.ios.min.css\">
    <!-- Path to Framework7 iOS related color styles -->
    <link rel=\"stylesheet\" href=\"path/to/framework7.ios.colors.min.css\">
    <!-- Path to your custom app styles-->
    <link rel=\"stylesheet\" href=\"path/to/my-app.css\">
  </head>
  <body>
    <!-- Status bar overlay for full screen mode (PhoneGap) -->
    <div class=\"statusbar-overlay\"></div>
    <!-- Panels overlay-->
    <div class=\"panel-overlay\"></div>
    <!-- Left panel with reveal effect-->
    <div class=\"panel panel-left panel-reveal\">
      <div class=\"content-block\">
        <p>Left panel content goes here</p>
      </div>
    </div>
    <!-- Views -->
    <div class=\"views\">
      <!-- Your main view, should have \"view-main\" class -->
      <div class=\"view view-main\">
        <!-- Top Navbar-->
        <div class=\"navbar\">
          <div class=\"navbar-inner\">
            <!-- We need cool sliding animation on title element, so we have additional \"sliding\" class -->
            <div class=\"center sliding\">Awesome App</div>
            <div class=\"right\">
              <!-- 
                Right link contains only icon - additional \"icon-only\" class
                Additional \"open-panel\" class tells app to open panel when we click on this link
              -->
              <a href=\"#\" class=\"link icon-only open-panel\"><i class=\"icon icon-bars\"></i></a>
            </div>
          </div>
        </div>
        <!-- Pages container, because we use fixed-through navbar and toolbar, it has additional appropriate classes-->
        <div class=\"pages navbar-through toolbar-through\">
          <!-- Page, \"data-page\" contains page name -->
          <div data-page=\"index\" class=\"page\">
            <!-- Scrollable page content -->
            <div class=\"page-content\">
              <p>Page content goes here</p>
              <!-- Link to another page -->
              <a href=\"about.html\">About app</a>
            </div>
          </div>
        </div>
        <!-- Bottom Toolbar-->
        <div class=\"toolbar\">
          <div class=\"toolbar-inner\">
            <!-- Toolbar links -->
            <a href=\"#\" class=\"link\">Link 1</a>
            <a href=\"#\" class=\"link\">Link 2</a>
          </div>
        </div>
      </div>
    </div>
    <!-- Path to Framework7 Library JS-->
    <script type=\"text/javascript\" src=\"path/to/framework7.min.js\"></script>
    <!-- Path to your app js-->
    <script type=\"text/javascript\" src=\"path/to/my-app.js\"></script>
  </body>
</html>       
";
    }

    public function getTemplateName()
    {
        return "index.html";
    }

    public function getDebugInfo()
    {
        return array (  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "index.html", "C:\\Users\\Lenovo\\Desktop\\2dgate\\src\\public\\templates\\index.html");
    }
}
