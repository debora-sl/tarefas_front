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
    
    // variavel para mostrar listando ou cadastrando
    $scope.acao = 'listando';

    // criando objeto projetos
    $scope.projetos = [];

    // listando os projetos
    $scope.listar = function(){
        $http.get('http://localhost:8000/api/projetos/listar', $config).then(function(response){
            if(response.status == 200){
                $scope.projetos = tratarDados(response.data);
                console.log('Projetos cadastrados: ', $scope.projetos);
            }
                
            }, function(error){
                console.log(error);
            });
    };

    // função para tratar as datas
    tratarDados = function (dados) {
        for (x = 0; x < dados.length; x++) {
            dados[x]['dataDeInicio'] = new Date(dados[x]['dataDeInicio']);
            dados[x]['dataDeConclusao'] =  new Date(dados[x]['dataDeConclusao']);
        }
        return dados;
    }

    // função para tratar as datas consultadas
    tratarDadosConsultar = function (dados) {

        dados['dataDeInicio'] = new Date(dados['dataDeInicio']);
        dados['dataDeConclusao'] =  new Date(dados['dataDeConclusao']);

        return dados;
    }

    // função para consultar projetos
    $scope.consultar = function(id){
        url = 'http://localhost:8000/api/projetos/consultar/' + id;

        $http.get(url, $config).then(function(response){
            if(response.status = 200){
                $scope.editarProjeto = tratarDadosConsultar(response.data);
                $scope.acao = 'editando';
            }
            console.log('Consulta: ', response);
            
        }, function(error){
            console.log(error);
            
        });

    }
    
    // chamando a função listar
    $scope.listar();

    // variavel projetos
    $scope.novoProjeto = {
        nome: '',
        descricao: '',
        dataDeInicio: '',
        dataDeConclusao: '',
        pontos: '',
        prioridade:''  
    }

    // variavel editar projetos
    $scope.editarProjeto = {
        id: '',
        nome: '',
        descricao: '',
        dataDeInicio: '',
        dataDeConclusao: '',
        pontos: '',
        prioridade:''  
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

    $scope.deletarModal = function (id) {
        Swal.fire({
            title: "Você tem certeza?",
            text: "Deletar este projeto é uma ação irreversível!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, delete isso!",
            cancelButtonText: "Não delete!"
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.deletarDeVerdade(id);
            }
        });
    }

    $scope.deletarDeVerdade = function (id) {
        $http.delete('http://localhost:8000/api/projetos/deletar/' + id, $config).then(function (response) {
            if (response.status == 200) {
                Swal.fire({
                    title: "Deletado!",
                    text: "Seu projeto foi deletado",
                    icon: "success"
                });
                $scope.listar();
            }
        }, function (error) {
            console.log(error);
        });
    }

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
                        $scope.$apply(function(){
                            $scope.listandoProjetoAcao();
                        })
                    }
                });
            }   
        }, function(error){
            console.log('Projeto não cadastrado!', error);
        })
    }
});