angular.module('meuApp', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('comMenu', {
        abstract: true,
        templateUrl: 'app/views/partials/comHeaderFooterEMenu.html',
        controller: ''
    })
    .state('comMenu.home', {
        url: '/',
        templateUrl: 'app/views/paginas/home.html',
        controller: 'HomeController'
    })
    .state('login', {
        url: '/login',
        templateUrl: 'app/views/paginas/login.html',
        controller: 'LoginController'
    })
    .state('cadastro', {
        url: '/cadastro',
        templateUrl: 'app/views/paginas/cadastro.html',
        controller: 'CadastroController'
    })

    $urlRouterProvider.otherwise('/');
});