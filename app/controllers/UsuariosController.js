angular.module('meuApp')
.controller('UsuariosController', function($scope, $http){
    console.log('UsuariosController funcionou!');

    // pegando o token e passando para a config
    $token = localStorage.getItem('token');
    $config = {
        headers: {
            'Authorization': 'Bearer' + $token
        }
    }

    // variável para listar os usuarios
    $scope.acao = 'listando';

    // função que muda o valor do ação, para exibir o formulário de cadastrar usuarios
    $scope.novoUsuarioAcao = function(){
        $scope.acao = 'cadastrando'
    }

    // função que muda o valor do ação, para exibir a tabela com os usuarios
    $scope.listandoUsuarioAcao = function(){
        $scope.acao = 'listando'
    }

    // variável para novo usuario
    $scope.novoUsuario = {
        name: '',
        email: '',
        password: ''
    }

    // variável para editar usuario
    $scope.editarUsuario = {
        id: '',
        nome: '',
        email: '',
        password: ''
    }

    // objeto usuarios
    $scope.usuarios = [];


    // função que limpa o formulário
    $scope.limpar = function(){
        $scope.novoUsuario = {
            name: '',
            email: '',
            password: ''
        }
    }

    // função que cria um novo usuario
    $scope.cadastrarNovoUsuario = function(){
        console.log('Botão novo usuario foi clicado');
        console.log($scope.novoUsuario);

        url = 'http://localhost:8000/api/usuarios/criar';

        $http.post(url, $scope.novoUsuario, $config).then(function(response){
            console.log('Usuário cadastrado', response);
            
            if (response.status == 201) {
                $scope.limpar();
                Swal.fire({
                    title: "Usuário cadastrado!",
                    text: "Deseja cadastrar um novo usuário?!",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sim, cadastrar um novo usuário!",
                    cancelButtonText: "Não, eu acabei!"
                }).then((result) => {
                    $scope.listar();
                    if (result.isDismissed) {
                            $scope.$apply(function () {
                            $scope.listandoUsuarioAcao();
                        });
                    }
                });
            }
        }, function(error){
            console.log('Usuário não cadastrado!', error);

            Swal.fire({
                title: "Os dados não estão corretos",
                text: "Gostaria de tentar novamente?",
                icon: "question"
            });
        })
    }

    // função que lista os usuarios
    $scope.listar = function(){
        url = 'http://localhost:8000/api/usuarios/listar';

        $http.get(url, $config).then(function(response){
            if(response.status == 200){
                // salvando os dados no objeto projeto. E chamando a função tratar dados
                $scope.usuarios = response.data;
                console.log('Usuarios cadastrados: ', $scope.usuarios);
            }
        }, function(error){
            if(error.status == 401){
                logout();
            }
            console.log('Erro: ', error);
        })
    }

    // chamando a função que lista
    $scope.listar();

    // função que verifica se quer deletar mesmo
    $scope.deletarModal = function(id){
        Swal.fire({
            title: "Você tem certeza?",
            text: "Deletar este usuário é uma ação irreversível!",
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
        url = 'http://localhost:8000/api/usuarios/deletar/' + id;

        $http.delete(url, $config).then(function(response){
            if(response.status == 200){
                // deletando o usuário
                Swal.fire({
                    title: "Deletado!",
                    text: "Usuário foi deletado.",
                    icon: "success"
                });
                $scope.listar();
            }
        }, function(error){
            console.log('Erro, usuário não deletado!: ', error);
        })
    }

    // função que consulta e traz os dados para o formulário editar
    $scope.consultar = function(id){
        url = 'http://localhost:8000/api/usuarios/consultar/' + id;

        $http.get(url, $config).then(function(response){
            if(response.status = 200){
                $scope.editarUsuario = response.data;
                $scope.acao = 'editando';
                console.log('Usuário para editar',  $scope.editarUsuario);
            }       
        }, function(error){
            console.log('Deu erro aqui!', error);    
        })
    }

    // função que salva a edição em um projeto
    $scope.salvarEdicaoUsuario = function(){
        url = 'http://localhost:8000/api/usuarios/editarUmaInformacao/' + $scope.editarUsuario.id;
        $http.patch(url, $scope.editarUsuario, $config).then(function(response){
            if(response.status == 200){
                // editando o usuario
                Swal.fire({
                    title: "Editado!",
                    text: "Usuário foi editado.",
                    icon: "success"
                });
                $scope.listar();
                $scope.acao = 'listando';
            }
            
        }, function(error){
            // checando se token está válido, se não tiver, direciona para se logar
            if(error.status == 401){
                logout();
            }
            console.log(error);
        })
    }

    // função para deslogar usuários
    logout = function(){

        //removendo o token do localStorage
        localStorage.removeItem('token');

        // direcionando o usuário para o login
        $IsStateFilter.go('login');
    }
});