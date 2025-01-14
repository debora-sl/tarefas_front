angular.module('meuApp')
.controller('ProjetosController', function($scope, $http){
    console.log('ProjetosController funcionou!');

    // verificando se o usuário está autenticado
    $token = localStorage.getItem('token');
    $config = {
        headers: {
            'Authorization': 'Bearer' + $token
        }
    }

    // variavel projetos
    $scope.novoProjeto = {
        nome: '',
        descricao: '',
        dataDeInicio: '',
        dataDeConclusao: '',
        pontos: ''    
    }

    // função que limpa o formulário
    $scope.limpar = function () {

        $scope.novoProjeto = {
            nome: '',
            descricao: '',
            dataDeInicio: '',
            prioridade: 'normal',
            dataDeConclusao: '',
            pontos: ''
        }

    }

    // variavel para mostrar listando ou cadastrando
    $scope.acao = 'listando';

    $scope.novoProjetoAcao = function(){
        $scope.acao = 'cadastrando';
    }

    $scope.listandoProjetoAcao = function(){
        $scope.acao = 'listando';
    }

    // cadastrando novo projeto e salvando no BD
    $scope.cadastrarNovoProjeto = function(){
        console.log('Projeto: ', $scope.novoProjeto);

        $http.post('http://localhost:8000/api/projetos/criar', $scope.novoProjeto, $config).then(function(response){
            console.log('Projeto cadastrado!', 200);
            if (response.status == 201) {
                $scope.limpar();
                Swal.fire({
                    title: "Projeto cadastrado!",
                    text: "Deseja cadastrar um novo projeto?!",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sim, cadastrar um novo projeto!",
                    cancelButtonText: "Não, eu acabei!"
                }).then((result) => {
                    $scope.listar();
                    console.log(result);
                    if (result.isDismissed) {
                        $scope.acao.pagina = 'listando';
                    }
                });
            }   
        }, function(error){
            console.log('Projeto não cadastrado!', error);
        })
        
    }

});