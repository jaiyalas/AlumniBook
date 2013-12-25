var app = angular.module('sdmApp', ['ngRoute','chieffancypants.loadingBar', 
                                    'ngAnimate', 'ui.jq', 'ui.bootstrap', 
                                    'ngCookies', 'angularMoment']);

$(document).on('ready page:load page:change', function() {
    if (window.location.hash == '#_=_'){
        window.location.hash = '';
    }
    angular.bootstrap(document, ['sdmApp']);
});


app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
// app.config(['$sceDelegateProvider', function($sceDelegateProvider) {
//      $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://localhost:3000/**', 'http://localhost:3000/*']);
// }]);

app.config(function ($locationProvider, $routeProvider) {
    // $locationProvider.html5Mode(true);
    
    $routeProvider
    .when('/', {
        templateUrl: './javascripts/templates/topic/topicIndex.html',
        controller: 'TopicIndexController'
    })
    .when('/topics', {
        templateUrl: './javascripts/templates/topic/topicList.html',
        controller: 'TopicListController'
    })
    .when('/topics/create', {
        templateUrl: './javascripts/templates/topic/topicCreate.html',
        controller: 'TopicCreateController',
        resolve: {
            currentUser: function($location, userAuthFactory){
                if(!userAuthFactory.currentUser().isLogged){
                    $location.path('users/login');
                }
                else{
                    return userAuthFactory.currentUser();
                }
            }
        }
    })
    .when('/topics/tags/:tagId', {
        templateUrl: './javascripts/templates/topic/topicTagList.html',
        controller: 'TopicTagListController'
    })
    .when('/topics/:topicId', {
        templateUrl: './javascripts/templates/topic/topicShow.html',
        controller: 'TopicShowController'
    })
    .when('/topics/:topicId/edit', {
        templateUrl: './javascripts/templates/topic/topicEdit.html',
        controller: 'TopicEditController'
    })
    .when('/users/login', {
        templateUrl: './javascripts/templates/user/userLogin.html',
        controller: 'UserLoginController'
    })
    .when('/users/login/error', {
        templateUrl: './javascripts/templates/user/userLoginError.html'
    })
    .when('/users/sign_up', {
        templateUrl: './javascripts/templates/user/userSignup.html',
        controller: 'UserSignupController'
    })
    .when('/users/edit', {
        templateUrl: './javascripts/templates/user/userEdit.html',
        controller: 'UserEditController',
        resolve: {
            currentUser: function($location, userAuthFactory){
                if(!userAuthFactory.currentUser().isLogged){
                    $location.path('users/login');
                }
                else{
                    return userAuthFactory.currentUser();
                }
            }
        }
    })
    .when('/users/:id', {
        templateUrl: './javascripts/templates/user/userProfile.html',
        controller: 'UserProfileController'
    })
    .when('/users/:id/followers', {
        templateUrl: './javascripts/templates/user/userFollowers.html',
        controller: 'UserFollowersController'
    })
    .when('/users', {
        templateUrl: './javascripts/templates/user/userList.html',
        controller: 'UserListController'
    })
    .otherwise({
        template: "This doesn't exist!"
    });
});

app.run(function($rootScope, $http, $location){
    if(window.location.hostname == 'localhost'){
        $rootScope.apiRoot = 'http://localhost:3000';
        // $rootScope.urlRoot = 'http://sdm.herokuapp.com';
        $rootScope.linkRoot = '/';
    }
    else{
        $rootScope.apiRoot = 'http://sdm.herokuapp.com';
        $rootScope.linkRoot = '/~Group3/'
    }
});


app.directive('ladda', function(){
    return {
        require: '?ngModel',
        restrict: 'A',
        link : function postLink(scope, attr, elem, ctrl){    

            var l = Ladda.create( document.querySelector('#'+elem.id));

            scope.$watch('loading', function(newVal, oldVal){
                if (newVal !== undefined){
                    if(newVal)
                        l.start();
                    else
                        l.stop(); 
                }
            });
        } 
    };
});

app.factory('userAuthFactory', function($http, $cookies, $cookieStore, $route) {
    var defaultUserAuth = {
        isLogged: false,
        data: {},
        accessToken: ''
    };

    var userAuthFactory = {
        isLogged: function(){
            var userAuth = $cookieStore.get('ab_user');
            if(!userAuth){
                userAuth = defaultUserAuth;
            }
            return userAuth.isLogged
        },
        currentUser: function(){
            var userAuth = $cookieStore.get('ab_user');
            if(!userAuth){
                userAuth = defaultUserAuth;
            }
            return userAuth
        },
        login: function(data){
            var userAuth = $cookieStore.get('ab_user');
            userAuth = defaultUserAuth;
            userAuth.isLogged = true;
            userAuth.data = data;

            $cookieStore.put('ab_user', userAuth);
        },
        logout: function(){
            $cookieStore.put('ab_user', {
                isLogged: false,
                data: {},
                accessToken: ''
            });
        }
    }

    return userAuthFactory;
});



app.run(function($rootScope, $http, $location, userAuthFactory, $cookies){
    console.log(userAuthFactory.currentUser());
    $rootScope.currentUser = userAuthFactory.currentUser();

    $rootScope.logout = function () {
        console.log('logout');
        userAuthFactory.logout();
        console.log(userAuthFactory.currentUser())
        $rootScope.currentUser = userAuthFactory.currentUser();
        $location.path('/');
    };

    $rootScope.getUser = function() {
    };

    $rootScope.avatarUrl = function(url){
        var avatarUrl = $rootScope.apiRoot+url;
        return avatarUrl; 
    }
});


app.directive('dropZone', function() {
    return {
        restrict: 'A',
        // scope: true,
        link: function(scope, element, attrs) {
            element.dropzone({ 
                url: scope.apiRoot+"/api/users/profile/avatar",
                maxFilesize: 5,
                paramName: "avatar",
                maxThumbnailFilesize: 5,
                headers: {
                    'Authorization': 'Bearer ' + scope.currentUser.data.id   
                },
                maxFiles: 1,
                addRemoveLinks: false,
                init: function() {
                    this.on("addedfile", function(file) { 
                        console.log('add file');
                        console.log(file);
                    });

                    // this.on("removedfile", function(file){
                    //     console.log('remove file');
                    //     for(var i=0; i<scope.product.images.length; i++){
                    //         if(scope.product.images[i].file == file){
                    //             scope.product.images.splice(i, 1);
                    //             scope.$apply();
                    //             break;
                    //         }
                    //     }
                    // });

                    this.on("success", function(file, response){
                        console.log('success');
                        console.log(response);
                        scope.user = response;
                        scope.$apply();
                        this.removeAllFiles();
                        // response.file = file;
                        // scope.product.images.push(response);
                        // scope.$apply();
                    });

                    this.on("error", function(file, response){
                        console.log('error');
                        console.log(response);
                        scope.error.message = response;
                        scope.$apply();
                    });

                    this.on("maxfilesexceeded", function(file) {
                        this.removeFile(file);
                        // this.removeAllFiles();
                        // this.addFile(file);
                    });
                }
            });
        }
    };
});

app.value('uiJqConfig', {
    backstretch: {}
    // The Tooltip namespace
    // magnificPopup: {
    //     delegate: 'a',
    //     type: 'image',
    //     gallery: {enabled: true}
    // },
    // nailthumb: {
    // },
    // tagsInput: {
    //     'height':'100px',
    //     'width':'500px'
    // }
});


app.directive('tagManager', function() {
    return {
        restrict: 'E',
        scope: { tags: '=' },
        template:
            '<div class="tags">' +
                '<a ng-repeat="(idx, tag) in tags" class="tag btn btn-success btn-sm" ng-click="remove(idx)">{{tag}}</a>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-xs-4">' +
            '<input type="text" class="form-control input-sm" placeholder="Add a tag..." ng-model="new_value"></input> ' +
            '</div>'+
            '<a class="btn btn-info btn-sm" ng-click="add()">Add</a>' +
            '</div>',
        link: function ( $scope, $element ) {
            // FIXME: this is lazy and error-prone
            var input = angular.element( $element.children()[1] );
            
            // This adds the new tag to the tags array
            $scope.add = function() {
                $scope.tags.push( $scope.new_value );
                $scope.new_value = "";
            };
            
            // This is the ng-click handler to remove an item
            $scope.remove = function ( idx ) {
                $scope.tags.splice( idx, 1 );
            };
            
            // Capture all keypresses
            input.bind( 'keypress', function ( event ) {
                // But we only care when Enter was pressed
                if ( event.keyCode == 13 ) {
                    // There's probably a better way to handle this...
                    $scope.$apply( $scope.add );
                }
            });
        }
    };
});










// communicate with server session
// app.run(function($rootScope, currentUserFactory){
//      // check user
//     currentUserFactory.check().then(function(currentUser){
//         $rootScope.currentUser = currentUser;
//     });
//     // handle user logout
//     $rootScope.logout = function(){
//         currentUserFactory.logout().then(function(currentUser){
//             $rootScope.currentUser = currentUser;
//         });
//     };
// });

// app.factory('currentUserFactory', function($http) {
//     var currentUser;

//     var currentUserFactory = {
//         check: function() {
//             // $http returns a promise, which has a then function, which also returns a promise
//             var promise = $http.get('/api/users.json').then(function (response) {
//                 currentUser = {};
//                 // The then function here is an opportunity to modify the response
//                 // console.log(response);
//                 if(response.data == 'null')
//                 {
//                     currentUser.isLogged = false;
//                 }
//                 else
//                 {
//                     currentUser.isLogged = true;
//                     currentUser.data = response.data;
//                 }
//                 // The return value gets picked up by the then in the controller.
//                 return currentUser;
//             });
//             // Return the promise to the controller
//             return promise;
//         },
//         logout: function() {
//             var promise = $http.delete('/users/sign_out').then(function (response) {
//                 currentUser = {};
//                 // The then function here is an opportunity to modify the response
//                 // console.log(response);
//                 if(response.status == 204)
//                     currentUser.isLogged = false;
//                 return currentUser;
//             });
//             // Return the promise to the controller
//             return promise;
//         },
//         currentUser: function() {
//             return currentUser;
//         }

//   };
//   return currentUserFactory;
// });


