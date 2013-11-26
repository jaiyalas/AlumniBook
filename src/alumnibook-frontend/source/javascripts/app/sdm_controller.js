app.controller('TopicIndexController', function($scope, $http, cfpLoadingBar, userAuthFactory){
    $scope.currentUser = userAuthFactory.currentUser();

    cfpLoadingBar.inc();
    $http({
        method: 'GET',
        url: $scope.apiRoot+'/api/topics/recent',
        withCredentials: true,
        headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
    }).success(function(data){
        cfpLoadingBar.complete();
        console.log(data);
        $scope.topics = data;
        angular.forEach($scope.topics, function(topic, index){
            if(topic.content){
                if(topic.content.length > 100){
                    topic.content = topic.content.substring(0,100);
                    topic.content = topic.content + ' ......';
                }
            }
            // $scope.topics[index] = $scope.topics[index].substring(0,100);
        });
    });

    $http({
        method: 'GET',
        url: $scope.apiRoot+'/api/users/recent',
        withCredentials: true,
        headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
    }).success(function(data){
        console.log(data);
        $scope.recentUsers = data;
    });


});

app.controller('TopicListController', function($scope, $http, cfpLoadingBar, userAuthFactory){
    $scope.currentUser = userAuthFactory.currentUser();

    cfpLoadingBar.inc();
    $http({
        method: 'GET',
        url: $scope.apiRoot+'/api/topics',
        withCredentials: true,
        headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
    }).success(function(data){
        cfpLoadingBar.complete();
        console.log(data);
        $scope.topics = data;
        angular.forEach($scope.topics, function(topic, index){
            if(topic.content){
                if(topic.content.length > 100){
                    topic.content = topic.content.substring(0,100);
                    topic.content = topic.content + ' ......';
                }
            }
            // $scope.topics[index] = $scope.topics[index].substring(0,100);
        });
    });

    $http({
        method: 'GET',
        url: $scope.apiRoot+'/api/users/recent',
        withCredentials: true,
        headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
    }).success(function(data){
        console.log(data);
        $scope.recentUsers = data;
    });
});

app.controller('TopicShowController', function($scope, $routeParams, $http, $timeout, cfpLoadingBar, userAuthFactory){
    $scope.currentUser = userAuthFactory.currentUser();
    $scope.topicId = $routeParams.topicId;
    $scope.comment = {};

    $scope.updateTopic = function(){
        cfpLoadingBar.inc();
        $http({
            method: 'GET',
            url: $scope.apiRoot+'/api/topics/'+$scope.topicId,
            withCredentials: true,
            headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
        }).success(function(response){
            console.log(response);
            $scope.topic = response;
            cfpLoadingBar.complete();
        }).error(function(response){
            console.log(response);
            if(response.message)
                $scope.error.message = response.message;
            if(response.error)
                $scope.error.message = response.error;
        });
    };
    $scope.updateTopic();


    $scope.follow = function(){
        $scope.loading = true;
        $http({
            method: 'POST',
            url: $scope.apiRoot+'/api/topics/follow',
            data: {topic_id: $scope.topic.id},
            headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
        }).success(function(response){
            console.log(response);
            $scope.topic = response;   
            $scope.loading = false;
        }).error(function(response){
            console.log(response);
            $scope.loading = false;
            if(response.message)
                $scope.error.message = response.message;
            if(response.error)
                $scope.error.message = response.error;
        });
    };

    $scope.unfollow = function(){
        $scope.loading = true;
        $http({
            method: 'POST',
            url: $scope.apiRoot+'/api/topics/unfollow',
            data: {topic_id: $scope.topic.id},
            headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
        }).success(function(response){
            console.log(response); 
            $scope.topic = response;   
            $scope.loading = false;     
            
        }).error(function(response){
            console.log(response);
            $scope.loading = false;
            if(response.message)
                $scope.error.message = response.message;
            if(response.error)
                $scope.error.message = response.error;
        });
    };



    $scope.submitComment = function(){
        if($scope.comment.comment){
            $scope.loading = true;

            $http({
                method: 'POST',
                url: $scope.apiRoot+'/api/comments',
                data: {
                    topic_id: $scope.topicId,
                    comment: $scope.comment.comment
                },
                withCredentials: true,
                headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
            }).then(function(response){
                console.log(response);
                $scope.loading = false;
                $scope.updateTopic();

                $scope.comment = {};
            });

        }
    }
});


app.controller('TopicEditController', function($scope, $routeParams, $http, $timeout, $location, cfpLoadingBar, userAuthFactory){
    $scope.currentUser = userAuthFactory.currentUser();
    $scope.topicId = $routeParams.topicId;
    $scope.comment = {};

    $scope.updateTopic = function(){
        cfpLoadingBar.inc();
        $http({
            method: 'GET',
            url: $scope.apiRoot+'/api/topics/'+$scope.topicId,
            withCredentials: true,
            headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
        }).success(function(response){
            console.log(response);
            $scope.topic = response;
            if($scope.topic.tags.length > 0){
                angular.forEach($scope.topic.tags, function(tag, index){
                    $scope.topic.tags[index] = tag.name;
                });
            }
            cfpLoadingBar.complete();
        }).error(function(response){
            console.log(response);
            if(response.message)
                $scope.error.message = response.message;
            if(response.error)
                $scope.error.message = response.error;
        });
    };
    $scope.updateTopic();

    $scope.submit = function() {
        console.log('submit');
        $scope.loading = true;

        $http({
            method: 'POST',
            url: $scope.apiRoot+'/api/topics/'+$scope.topicId,
            withCredentials: true,
            headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id},
            data: {
                title: $scope.topic.title,
                content: $scope.topic.content,
                tag_list: $scope.topic.tags.toString()
            }
        }).then(function(response){
            console.log(response);
            $scope.loading = false;
            $location.path('topics/'+response.data.id);
        });

    };

    
});

app.controller('TopicCreateController', function($scope, $routeParams, $http, $location, userAuthFactory){
    $scope.currentUser = userAuthFactory.currentUser();
    $scope.topic = {}
    $scope.topic.tags = [];

    $scope.submit = function() {
        console.log('submit');
        $scope.loading = true;

        $http({
            method: 'POST',
            url: $scope.apiRoot+'/api/topics',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id},
            data: {
                title: $scope.topic.title,
                content: $scope.topic.content,
                tag_list: $scope.topic.tags.toString()
            }
        }).then(function(response){
            console.log(response);
            $scope.loading = false;
            $location.path('topics/'+response.data.id);
        });

    };

});


app.controller('UserLoginController', function($scope, $http, $location, userAuthFactory){
    $scope.currentUser = userAuthFactory.currentUser();
    $scope.user = {
        main_id: '',
        password: ''
    }
    $scope.error = {};

    $scope.submit = function(){
        console.log('submit');
        $scope.error = {};

        $scope.loading = true;
        $http({
            method: 'POST',
            url: $scope.apiRoot+'/api/users/login',
            data: {
                main_id: $scope.user.main_id,
                password: $scope.user.password
            }
        }).success(function(response){
            console.log(response);
            $scope.loading = false;
            userAuthFactory.login(response);
            $location.path('/');
        }).error(function(response){
            console.log(response);
            $scope.error.message = response.message;
            $scope.loading = false;
        });
    }

});

app.controller('UserSignupController', function($scope, $http, $location, userAuthFactory){
    $scope.currentUser = userAuthFactory.currentUser();
    $scope.user = {
        main_id: '',
        password: '',
        password_confirmation: '',
        email: ''
    }
    $scope.error = {}

    $scope.submit = function(){
        console.log('submit');
        $scope.error = {};

        $scope.user.email = $scope.user.main_id.toLowerCase() + '@ntu.edu.tw'
        $scope.loading = true;
        $http({
            method: 'POST',
            url: $scope.apiRoot+'/api/users/sign_up',
            data: {
                main_id: $scope.user.main_id,
                password: $scope.user.password,
                password_confirmation: $scope.user.password_confirmation,
                email: $scope.user.email
            }
        }).success(function(response){
            console.log(response);
            $scope.loading = false;
            userAuthFactory.login(response);
            $location.path('/users/edit');

        }).error(function(response){
            console.log(response);
            $scope.error.message = response.message;
            $scope.loading = false;
        });
    }

});


app.controller('UserProfileController', function($scope, $http, $location, $routeParams, userAuthFactory){
    $scope.currentUser = userAuthFactory.currentUser();
    console.log($routeParams['id'])
    $scope.userId = $routeParams['id'];
    $scope.error = {};

    $http({
        method: 'GET',
        url: $scope.apiRoot+'/api/users/profile/'+$scope.userId,
        withCredentials: true,
        headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
    }).success(function(response){
        console.log(response);
        $scope.profile = response;
    }).error(function(response){
        console.log(response);
        if(response.message)
            $scope.error.message = response.message;
        if(response.error)
            $scope.error.message = response.error;
    });

    $http({
        method: 'GET',
        url: $scope.apiRoot+'/api/topics/users/'+$scope.userId,
        withCredentials: true,
        headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
    }).success(function(data){
        console.log(data);
        $scope.topics = data;
        // angular.forEach($scope.topics, function(topic, index){
        //     if(topic.content){
        //         if(topic.content.length > 100){
        //             topic.content = topic.content.substring(0,100);
        //             topic.content = topic.content + ' ......';
        //         }
        //     }
        // });
    });


    $scope.follow = function(){
        $scope.loading = true;
        $http({
            method: 'POST',
            url: $scope.apiRoot+'/api/users/follow',
            data: {user_id: $scope.profile.id},
            headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
        }).success(function(response){
            console.log(response);
            $scope.profile = response;
            $scope.loading = false;
            // $scope.loading = false;
        }).error(function(response){
            console.log(response);
            $scope.loading = false;
            if(response.message)
                $scope.error.message = response.message;
            if(response.error)
                $scope.error.message = response.error;
        });
    };

    $scope.unfollow = function(){
        $scope.loading = true;
        $http({
            method: 'POST',
            url: $scope.apiRoot+'/api/users/unfollow',
            data: {user_id: $scope.profile.id},
            headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
        }).success(function(response){
            console.log(response);
            $scope.loading = false;
            $scope.profile = response;
        }).error(function(response){
            console.log(response);
            $scope.loading = false;
            if(response.message)
                $scope.error.message = response.message;
            if(response.error)
                $scope.error.message = response.error;
        });
    };
});

app.controller('UserEditController', function($scope, $http, $location, $routeParams, userAuthFactory){
    $scope.currentUser = userAuthFactory.currentUser();
    $scope.user = userAuthFactory.currentUser().data;
    $scope.user.profile = {};
    $scope.error = {};
    $http({
        method: 'GET',
        url: $scope.apiRoot+'/api/users/profile/'+$scope.user.main_id,
        withCredentials: true,
        headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
    }).success(function(response){
        $scope.user = response;
        if(!$scope.user.careers){
            $scope.user.careers = [{}];
        }
        console.log($scope.user);
    })


    $scope.switchId = function(){
        if($scope.user.second_id){
            var temp_id = $scope.user.main_id;
            $scope.user.main_id = $scope.user.second_id;
            $scope.user.second_id = temp_id;
        }
    }

    $scope.addCareer = function(){
        $scope.user.careers.push({});
    }

    $scope.submit = function(){
        console.log('submit');
        $scope.loading = true;

        // if there is no careers
        if($scope.user.careers.length == 1 && !$scope.user.careers[0].organization){
            delete $scope.user['careers'];
        }

        $http({
            method: 'POST',
            url: $scope.apiRoot+'/api/users/profile',
            data: {user: $scope.user},
            withCredentials: true,
            headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
        }).success(function(response){
            console.log(response);
            $scope.loading = false;
            $location.path('/users/'+userAuthFactory.currentUser().data.main_id);
        }).error(function(response){
            console.log(response);
            $scope.error.message = response.message;
            $scope.loading = false;
        });

    }
    

});


app.controller('UserListController', function($scope, $http, cfpLoadingBar, userAuthFactory){
    $scope.currentUser = userAuthFactory.currentUser();

    cfpLoadingBar.inc();
    $http({
        method: 'GET',
        url: $scope.apiRoot+'/api/users',
        withCredentials: true,
        headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
    }).success(function(data){
        cfpLoadingBar.complete();
        console.log(data);
        $scope.users = data;
    });

    $http({
        method: 'GET',
        url: $scope.apiRoot+'/api/users/recent',
        withCredentials: true,
        headers: {'Authorization': 'Bearer '+userAuthFactory.currentUser().data.id}
    }).success(function(data){
        console.log(data);
        $scope.recentUsers = data;
    });


});






// // Product List Controller
// app.controller('ProductListController', function($scope, $http){
//     $http.get('/api/products', {params: {page: 1, per_page: 10}}).success(function(data){
//         console.log(data);
//         for(var i=0; i<data.data.length; i++){
//             data.data[i].description = data.data[i].description.replace(/\n/g, '<br />');
//         }
//         $scope.products = data.data;
//         $scope.current_page = data.current_page;
//         $scope.total_pages = data.total_pages;

        
//         $scope.nextPage = function(){
//             if($scope.current_page < $scope.total_pages){
//                 $scope.loading = true;
//                 $http.get('/api/products', {params: {page: $scope.current_page+1, per_page: 10}}).success(function(response){
//                     console.log(response);
//                     for(var i=0; i<response.data.length; i++){
//                         response.data[i].description = response.data[i].description.replace(/\n/g, '<br />');
//                         $scope.products.push(response.data[i]);
//                     }
//                     $scope.current_page = response.current_page;
//                     $scope.total_pages = response.total_pages;
//                     $scope.loading = false;
//                 })
//             }
//         }
//     });



// });

// // Product Create Controller
// app.controller('ProductCreateController', function($scope, $http, $location, $modal, userAuthFactory){
//     if(!userAuthFactory.currentUser().isLogged){
//         $location.path('/');
//     }

//     $scope.product = {};

//     $scope.onFileSelect = function($files) {
//         this.product.images = $files;
//     }

//     $scope.submit = function() {


//         $http({
//             method: 'POST',
//             url: '/api/products',
//             data: {product: this.product},
//             headers: {
//                 'Content-Type': false,
//                 'Authorization': 'Bearer ' + $scope.currentUser.accessToken
//             },
//             transformRequest: function (data) {
//                 console.log(data.product);
//                 var formData = new FormData();
//                 formData.append("product[name]", data.product.name);
//                 formData.append("product[description]", data.product.description);
//                 formData.append("product[price]", (data.product.price||0));
//                 formData.append("product[shipping_fee]", (data.product.shipping_fee||0));
//                 formData.append("product[quantity]", data.product.quantity);
//                 formData.append("product[tag_list]", data.product.tag_list.toString());
//                 angular.forEach(data.product.images, function(value, key) {
//                     formData.append("product[images][][image]", value);
//                 });
//                 return formData;
//             }
//         }).then(function(response){
//             console.log(response);
//             $scope.product = response.data;

//             var modalInstance = $modal.open({
//                 templateUrl: '/assets/modal/productPostFacebookModal.html',
//                 controller: function($scope, $modalInstance, $FB, product){
//                     $scope.product = product;

//                     $scope.ok = function () {
//                         if($scope.product.images.length > 0){
//                             console.log('images > 0');
//                             for(var i=0; i<$scope.product.images.length; i++)
//                             {
//                                 $FB.api('/me/photos', 'post',
//                                     {
//                                         message: $scope.product.name + ' - ' + $scope.product.description + '\n\n' + 'http://' + window.location.host + "/products/" + $scope.product.id,
//                                         url: 'http://'+ window.location.host + $scope.product.images[i].image.url
//                                     }, 
//                                     function (res) {
//                                         console.log(res);
//                                         $modalInstance.close();
//                                         $location.path("/products/" + $scope.product.id);
//                                     }
//                                 );
//                             }
//                         }
//                         else{
//                             $FB.api('/me/photos', 'post',
//                                 {
//                                     message: $scope.product.name + ' - ' + $scope.product.description
//                                 }, 
//                                 function (res) {
//                                     console.log(res);
//                                     $modalInstance.close();
//                                     $location.path("/products/" + $scope.product.id);
//                                 }
//                             );
//                         }
//                     };

//                     $scope.skip = function () {
//                         $modalInstance.dismiss('cancel');
//                         $location.path("/products/" + $scope.product.id);
//                     };
//                 },
//                 resolve: {
//                     product: function () {
//                         return $scope.product;
//                     }
//                 }
//             });

//             modalInstance.result.then(function () {
//               // $scope.selected = selectedItem;
//             }, function () {
//               // $log.info('Modal dismissed at: ' + new Date());
//             });

//             // $location.path("/products/"+response.data.id);
//         });
//     };

// });


// // Product View Controller
// app.controller('ProductViewController', function($scope, $routeParams, $http, $modal, userAuthFactory){
//     $scope.productId = $routeParams.productId;
//     $http.get('/api/products/'+$routeParams.productId).success(function(data){
//         $scope.product = data;
//         $scope.product.description = $scope.product.description.replace(/\n/g, '<br />');
//     });

//     // open send modal
//     $scope.send = function(){
//         var modalInstance = $modal.open({
//               templateUrl: '/assets/modal/productSendMessageModal.html',
//               controller: ProductSendMessageModalController,
//               resolve: {
//                 product: function () {
//                   return $scope.product;
//                 }
//               }
//         });
//     };

//     //
//     $scope.buy = function(){
//     };
// });

// // Message List Controller
// app.controller('MessageListController', function($scope, $http, userAuthFactory){
//     console.log(userAuthFactory.currentUser());
//     $scope.currentUser = userAuthFactory.currentUser();
//     $http({
//         method: 'GET',
//         url: '/api/messages',
//         headers:{
//             'Authorization': 'Bearer ' + $scope.currentUser.accessToken
//         }
//     }).then(function(response){
//         console.log(response);
//     });

// });


// // Modal Controller : ProductSendMessageModalController
// var ProductSendMessageModalController = function($scope, $modalInstance, $http, product, userAuthFactory){
//     $scope.message = {};
//     $scope.message.product = product;
//     $scope.message.content = '';
//     $scope.currentUser = userAuthFactory.currentUser();

//     $scope.send = function () {
//         if($scope.message.content){
//             $scope.loading = true;

//             $http({
//                 method: 'POST',
//                 url: '/api/messages',
//                 data: {message: $scope.message},
//                 headers: {
//                     'Content-Type': false,
//                     'Authorization': 'Bearer ' + $scope.currentUser.accessToken
//                 },
//                 transformRequest: function (data) {
//                     var formData = new FormData();
//                     formData.append("message[recipient_id]", data.message.product.user.id);
//                     formData.append("message[message]", data.message.content);
//                     formData.append("message[items][][product_id]", (data.message.product.id));
//                     formData.append("message[items][][quantity]", (1));
//                     return formData;
//                 }
//             }).then(function(response){
//                 console.log(response);
//                 $scope.loading = false;
//             });
//         }
//     }

//     $scope.cancel = function () {
//         $modalInstance.dismiss('cancel');
//     }
// };


// var ProductPostFacebookModalCtrl = function($scope, $modalInstance, product){
//     $scope.product = product;

//     $scope.ok = function () {
//         $modalInstance.close();
//     };

//     $scope.skip = function () {
//         $modalInstance.dismiss('cancel');
//     };
// };

