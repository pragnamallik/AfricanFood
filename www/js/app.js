// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', ['ionic'])
.controller('ctrl',function($scope,$http)
{
  var dbSize = 5 * 1024 * 1024; // 5MB
  $scope.webdb = {};
  // open database
  var db  = openDatabase("AfricanFoods", "1", "Todo manager", dbSize);

  //create table to use
  db.transaction(function (tx) 
  {
      tx.executeSql("CREATE TABLE IF NOT EXISTS " +
          "UserCredentials(username TEXT PRIMARY KEY, password TEXT)", [],
          function () 
          {
              console.log("Created");
          },
          function () 
          {
             console.log("Create failure") 
          }
      );
  });                

  $scope.login = function () 
  {
    db.transaction(function (tx) 
    {
      tx.executeSql("SELECT * FROM UserCredentials where username=? and password=?", 
                      [$scope.username,$scope.password],
        function (tx, rs) 
        {
          for (var i = 0; i < rs.rows.length; i++) 
          {
            window.location="home.html";
            break;
          }
          $scope.loginmessage="Invalid Username/Password";
          $scope.$apply();
        },
        function (err) 
        {
          console.log("Read failed");
        });
      }
    );
  }

  $scope.register = function () 
  {
    db.transaction(function (tx) 
    {
      if($scope.password!=$scope.confirmpassword)
      {
        $scope.regmessage="Passwords don't match";
        $scope.$apply();
      }
      else
      {      
        db.transaction(function (tx) 
        {
          tx.executeSql("INSERT INTO UserCredentials(username,password) VALUES(?, ?) ",
              [$scope.username,$scope.password],
              function () 
              {
                $scope.username="";
                $scope.password="";
                $scope.confirmpassword="";
                $scope.regmessage="Registered successfully!";
                $scope.$apply();
              },
              function () 
              {
                console.log("Insert failed");
                $scope.regmessage="Username already exists";
                $scope.$apply();          
              }
          );
        });
      }
    });
  }

  $scope.gotoIndexPage = function () 
  {
    window.location="index.html";
  }
  
  $scope.gotoHomePage = function () 
  {
    window.location="home.html";
  }
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
