angular.module('meuApp')
.controller('ProjetosController', function($scope, $http){
    console.log('ProjetosController funcionou!');

    // pegando o token e passando para a config
    $token = localStorage.getItem('token');
    $config = {
        headers: {
            'Authorization': 'Bearer' + $token
        }
    }

    // variável para listar os projetos
    $scope.acao = 'listando';

    // função que muda o valor do ação, para exibir o formulário de cadastrar projetos
    $scope.novoProjetoAcao = function(){
        $scope.acao = 'cadastrando'
    }

    // função que muda o valor do ação, para exibir a tabela com os projetos
    $scope.listandoProjetoAcao = function(){
        $scope.acao = 'listando'
    }

    // variável para novo projeto
    $scope.novoProjeto = {
        nome: '',
        descricao: '',
        dataDeInicio: '',
        dataDeConclusao: '',
        pontos: '',
        prioridade: 'Normal'
    }

    // objeto projetos
    $scope.projetos = [];

    // função que limpa o formulário
    $scope.limpar = function(){
        $scope.novoProjeto = {
            nome: '',
            descricao: '',
            dataDeInicio: '',
            dataDeConclusao: '',
            pontos: '',
            prioridade: 'Normal'
        }
    }

    // função que cria um novo projeto
    $scope.cadastrarNovoProjeto = function(){
        console.log('Botão novo projeto foi clicado');
        console.log($scope.novoProjeto);

        $scope.url = 'http://localhost:8000/api/projetos/criar';

        $http.post($scope.url, $scope.novoProjeto, $config).then(function(response){
            console.log('Projeto cadastrado', response);
            
            if (response.status == 201) {
                $scope.limpar();
                Swal.fire({
                    title: "Projeto cadastrado!",
                    text: "Deseja cadastrar um novo projeto?!",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sim, cadastrar um novo!",
                    cancelButtonText: "Não, eu acabei!"
                }).then((result) => {
                    $scope.listar();
                    console.log(result);
                    if (result.isDismissed) {
                        $scope.acao = 'listando';
                    }
                });
            }
        }, function(error){
            console.log('Projeto não cadastrado!', error);

            Swal.fire({
                title: "Os dados estão corretos",
                text: "Gostaria de tentar novamente?",
                icon: "question"
            });
        })
    }

    // função que lista os projetos
    $scope.listar = function(){
        $scope.url = 'http://localhost:8000/api/projetos/listar';

        $http.get($scope.url, $config).then(function(response){
            if(response.status == 200){
                // salvando os dados no objeto projeto. E chamando a função tratar dados
                $scope.projetos = tratarDados(response.data);
                console.log('Projetos cadastrados: ', $scope.projetos);
            }
        }, function(error){
            console.log('Erro: ', error);
        })
    }

    // função que converte as datas
    tratarDados = function (dados) {
        for (x = 0; x < dados.length; x++) {
            dados[x]['dataDeInicio'] = new Date(dados[x]['dataDeInicio']);
            dados[x]['dataDeConclusao'] =  new Date(dados[x]['dataDeConclusao']);
        }
        return dados;
    }

    // chamando a função que lista
    $scope.listar();

    // função que verifica se quer deletar mesmo
    $scope.deletarModal = function(id){
        Swal.fire({
            title: "Você tem certeza?",
            text: "Deletar este projeto é uma ação irreversível!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, delete isto!",
            cancelButtonText: "Não, cancelar!"
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.deletar(id);
            }
        });
    }

    // função que deleta mesmo no bd
    $scope.deletar = function(id){
        $scope.url = 'http://localhost:8000/api/projetos/deletar/' + id;

        $http.delete($scope.url, $config).then(function(response){
            if(response.status == 200){
                // deletando o projeto
                Swal.fire({
                    title: "Deletado!",
                    text: "Seu projeto foi deletado.",
                    icon: "success"
                });
                $scope.listar();
            }
        }, function(error){
            console.log('Erro, projeto não deletado!: ', error);
        })
    }

});