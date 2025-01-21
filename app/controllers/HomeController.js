angular.module('meuApp')
.controller('HomeController', function($scope, $http, $state){
    console.log('HomeController funcionou!');
    $token = localStorage.getItem('token');
    $config = {
        headers: {
            'Authorization': 'Bearer ' + $token
        }
    }

    logout = function(){
        localStorage.removeItem('token');
        $state.go('login');
    }

    $scope.listar = function () {
        $http.get('http://localhost:8000/api/projetos/listar', $config).then(function (response) {
            if (response.status == 200) {
                $scope.projetos = tratarDados(response.data);
            }
        }, function (error) {
            if(error.status == 401){
                logout();
            }
            console.log(error);
        });
    }

    $scope.listar();
});