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

   // função para deslogar usuários
   logout = function(){

    //removendo o token do localStorage
    localStorage.removeItem('token');

    // direcionando o usuário para o login
    $IsStateFilter.go('login');
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

    // variável para editar projeto
    $scope.editarProjeto = {
        id: '',
        nome: '',
        descricao: '',
        dataDeInicio: '',
        dataDeConclusao: '',
        pontos: '',
        prioridade: 'Normal',
        tarefas: []
    }

    // objeto projetos
    $scope.projetos = [];

    // função que adiciona tarefa
    $scope.adicionarTarefa = function () {
        $scope.novoProjeto.tarefas.push({ nome: '', id: Date.now() });
    }

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

        url = 'http://localhost:8000/api/projetos/criar';

        $http.post(url, $scope.novoProjeto, $config).then(function(response){
            console.log('Projeto cadastrado', response);
            
            if (response.status == 201) {

                for($i = 0; $i < $scope.novoProjeto.tarefas.length; $i++){
                    url = 'http://localhost:8000/api/tarefas/cadastrar';

                    post = {};
                    post.nome = $scope.novoProjeto.tarefas[$id].nome;
                    post.id_projeto = response.data.id;

                    $http.post(url, post, $config).then(function(response){
                        console.log('Terefa: ', response);
                        
                    }, function(error){
                        console.log('Erro: ', error);
                        
                    })
                    console.log( $scope.novoProjeto.tarefas[$i].nome); 
                }
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
                    if (result.isDismissed) {
                            $scope.$apply(function () {
                            $scope.listandoProjetoAcao();
                        });
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
        url = 'http://localhost:8000/api/projetos/listar';

        $http.get(url, $config).then(function(response){
            if(response.status == 200){
                // salvando os dados no objeto projeto. E chamando a função tratar dados
                $scope.projetos = tratarDados(response.data);
                console.log('Projetos cadastrados: ', $scope.projetos);
            }
        }, function(error){
            if(error.status == 401){
                logout();
            }
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
        url = 'http://localhost:8000/api/projetos/deletar/' + id;

        $http.delete(url, $config).then(function(response){
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

    // função que converte as datas de projetos consultados
    tratarDadosConsultados = function (dados) {
            $scope.acao = 'editando'
            dados['dataDeInicio'] = new Date(dados['dataDeInicio']);
            dados['dataDeConclusao'] =  new Date(dados['dataDeConclusao']);
        return dados;
    }

    // função que consulta e traz os dados para o formulário editar
    $scope.consultar = function(id){
        url = 'http://localhost:8000/api/projetos/consultar/' + id;

        $http.get(url, $config).then(function(response){
            if(response.status = 200){
                $scope.editarProjeto =  tratarDadosConsultados(response.data);
                console.log('Projeto para editar',  $scope.editarProjeto);
            }       
        }, function(error){
            console.log('Deu erro aqui!', error);    
        })
    }

    // função que salva a edição em um projeto
    $scope.salvarEdicaoProjeto = function(){
        url = 'http://localhost:8000/api/projetos/editarUmaInformacao/' + $scope.editarProjeto.id;
        $http.patch(url, $scope.editarProjeto, $config).then(function(response){
            if(response.status == 200){
                // editando o projeto
                Swal.fire({
                    title: "Editado!",
                    text: "Seu projeto foi editado.",
                    icon: "success"
                });
                $scope.listar();
                $scope.acao = 'listando';
            }
            
        }, function(error){
            console.log(error);
        })
    }

    // função para adicionar Tarefas no formulário de edição
    $scope.adicionarTarefaNaEdicao = function () {
        Swal.fire({
            input: "textarea",
            inputLabel: `Adicionando tarefa`,
            inputPlaceholder: '',
            showCancelButton: true
        }).then(function (result) {
            if (result.isConfirmed && result.value) {
                const text = result.value;
                $scope.$apply(function () {

                    post = {};
                    post.nome = text;
                    post.id_projeto = $scope.editarProjeto.id;

                    $http.post('http://localhost:8000/api/tarefas/criar', post, $config).then(function (response) {
                    $scope.consultar($scope.editarProjeto.id);

                    }, function (error) {
                        console.log(error);
                    })
                    // Aqui você pode chamar a função para atualizar a tarefa
                });
            }
        });
    }

    // função editar uma tarefa
    $scope.atualizaTarefa = function (id, nome) {
        post = {};
        post.nome = nome;

        url = 'http://localhost:8000/api/tarefas/editarUmaInformacao/' + id
        $http.patch(url, post, $config).then(function (response) {
            if (response.status == 200) {
                Swal.fire({
                    title: "Editado!",
                    text: "Sua tarefa foi editada",
                    icon: "success"
                });
                $scope.consultar($scope.editarProjeto.id);
            }
        }, function (error) {
            console.log('Erro', error);
        });
    }

    // função que verifica se quer deletar mesmo a tarefa
    $scope.deletarTarefaModal = function (id) {
        Swal.fire({
            title: "Você tem certeza?",
            text: "Deletar esta tarefa é uma ação irreversível!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, delete!",
            cancelButtonText: "Cancelar!"
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.deletarTarefa(id);
            }
        });
    }

    // função que deleta uma tarefa no bd
    $scope.deletarTarefa = function (id) {

        $http.delete('http://localhost:8000/api/tarefas/deletar/' + id, $config).then(function (response) {
            if (response.status == 200) {
                Swal.fire({
                    title: "Deletado!",
                    text: "Sua tarefa foi deletada",
                    icon: "success"
                });

                $scope.consultar($scope.editarProjeto.id);
            }
        }, function (error) {
            console.log(error);
        });
    }

 
});