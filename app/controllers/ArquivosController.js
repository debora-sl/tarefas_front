angular.module('meuApp')
    .controller('ArquivosController', function ($scope, $http) {
        console.log('ArquivosController funcionou!');

        // pegando o token e passando para a config
        var config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': undefined // Deixe o navegador definir corretamente
            }
        };

        // função para deslogar usuários
        logout = function () {

            //removendo o token do localStorage
            localStorage.removeItem('token');

            // direcionando o usuário para o login
            $IsStateFilter.go('login');
        }

        // variavel informações arquivo
        $scope.informacoes = {
            arquivo: ''
        }

        $scope.setArquivo = function (event) {
            var arquivo = event.target.files[0];
            if (arquivo) {
                $scope.informacoes.arquivo = arquivo;
                $scope.$apply();
                console.log('Arquivo selecionado: ', arquivo);
            }
        };

        // função cadastrar novo arquivo
        $scope.cadastrarNovoArquivo = function () {
            console.log($scope.informacoes);

            var formData = new FormData();
            formData.append('arquivo', $scope.informacoes.arquivo);
            console.log(formData);

            $url = 'http://localhost:8000/api/arquivos/salvarArquivo';
            $http.post($url, formData, config).then(function (response) {
                console.log(response);
            }, function (error) {
                console.log('Arquivo não cadastrado', error);
            })

        }


    });