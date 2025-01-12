angular.module('meuApp')
.controller('LoginController', function($scope, $http, $state){
    console.log('LoginController funcionou!');

    $scope.usuario = {
        email: '',
        password: ''
    }

    $token = localStorage.getItem('token');

    // verificando se o usuário já esta logado
    if ($token != null){
        $config = {
            headers: {
                'Authorization': 'Bearer' + $token
            }
        }

        $http.get('http://localhost:8000/api/me', $config).then(function(response){
            if(response.status == 200){
                $state.go('comMenu.home')
            }
        }, function(error){
            console.log(error);
            
        })
    }

    $scope.logar = function() {
        console.log('Botão login clicado!');
        
        // enviando o usuario para a API
        $http.post('http://localhost:8000/api/login', $scope.usuario).then(function(response){
            console.log('Dados ok', response);
            localStorage.setItem('token', response.data.token);
            $state.go('comMenu.home');
            
        }, function(error){
            console.log('Erro', error);

            Swal.fire({
                title: 'Error!',
                text: 'Login invalido',
                icon: 'error'
            });

            $scope.usuario = {
                email: '',
                password: ''
            }
            
        });
    }


    
});