angular.module('meuApp')
.controller('LogoutController', function($scope, $http, $state){
    console.log('LogoutController funcionou!');

    $token = localStorage.getItem('token');

    $config = {
        headers: {
            'Authorization': 'Bearer' + $token
        }
    }
        
        // enviando o usuario para a API
        $http.get('http://localhost:8000/api/logout', $config).then(function(response){
            console.log('Usuario deslogado', response);
            localStorage.removeItem('token');
            $state.go('login');
            
        }, function(error){
            console.log('Erro', error);
            localStorage.removeItem('token');
            $state.go('login');
            
        });

    
});