angular.module('meuApp')
    .controller('CadastroController', function ($scope, $http, $state) {
        console.log('CadastroController Não Autenticados funcionou!');

        // variável para novo usuario
        $scope.novoUsuario = {
            name: '',
            email: '',
            password: '',
            passwordConfirm: ''
        }

        // função que limpa o formulário
        $scope.limpar = function () {
            $scope.novoUsuario = {
                name: '',
                email: '',
                password: ''
            }
        }

        // função que cria um novo usuario - não autenticado
        $scope.cadastrarNovoUsuarioNaoAutenticado = function () {
            console.log('Botão novo usuario foi clicado');
            console.log($scope.novoUsuario);

            $urlCriarUsuarioNapAutenticado = 'http://localhost:8000/api/usuarios/usuarioCadastrar';

            if ($scope.novoUsuario.password == $scope.novoUsuario.passwordConfirm) {
                $http.post($urlCriarUsuarioNapAutenticado, $scope.novoUsuario).then(function (response) {
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
                            if (result.isDismissed) {
                                $scope.$apply(function () {
                                    // direcionando o usuário para o login
                                    $state.go('login');
                                });
                            }
                        });
                    }
                }, function (error) {
                    console.log('Usuário não cadastrado!', error);

                    if (error.status == 409) {
                        Swal.fire({
                            title: "Ops! O e-mail informado já está cadastrado.",
                            text: "Gostaria de tentar novamente?",
                            icon: "question"
                        });
                    } else {
                        console.log('Erro: ', error);

                        Swal.fire({
                            title: "Os dados não estão corretos",
                            text: "Gostaria de tentar novamente?",
                            icon: "question"
                        });
                    }
                })
            } else {
                Swal.fire({
                    title: "Erro, senhas diferentes!",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Tentar novamente!",
                })
            }
        }
    });