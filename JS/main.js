var db = openDatabase("Pharmacy", "1.0", "Pharmacy", 2 * 1024 * 1024);

$(function()
{

    db.transaction(function(tx)
    {
        tx.executeSql('CREATE TABLE if NOT EXISTS Users (Id UNIQUE , Username , Password , IsAdmin)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Items (Id UNIQUE , Name , Quantity , Picture)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Invoice (Id UNIQUE , Date , CustomerName , Type , ItemName , Quantity)');


        tx.executeSql('INSERT INTO USERS (Id , Username , Password , IsAdmin) VALUES (1 , "Admin" , "123" , TRUE )');

    });

    if(sessionStorage.userId != null){

        db.transaction(function (tx) {

            tx.executeSql('SELECT Username FROM Users WHERE Id = ' + sessionStorage.userId , [] , function (tx , results) {

                if(results.rows.length > 0){
                    var user = results.rows[0]['Username'];
                    $('#navbarDropdownMenuLink').html(user);
                }

            })

        });


        db.transaction(function (tx) {

            tx.executeSql('SELECT IsAdmin FROM Users WHERE Id = ' + sessionStorage.userId , [] , function (tx , results) {

                if(results.rows.length > 0){

                    var admin = results.rows[0]['IsAdmin'];

                    if(admin != 1){

                        $('#addUserLink').hide();


                    }

                }

            })

        })


    }

//-----------------------------------------------------------------------------------------------------------------

    $('#loginBtn').on("click" , function () {

        var username = $('#name').val();
        var pass = $('#password').val();



        db.transaction(function (tx) {

            tx.executeSql('SELECT Id FROM Users WHERE Username = "'+username+'" AND Password = "'+pass+'"' , [] , function (tx , results) {

                var records = results.rows.length;

                if(records > 0){

                    sessionStorage.userId = results.rows[0]['Id'];
                    window.location.href = 'after_login.html';



                }else {
                    alert('not found');
                }

            } )

        })

    });




//-----------------------------------------------------------------------------------------------------------------

$('#logoutBtn').on("click" , function () {

    sessionStorage.removeItem('userId');
    window.location.href = 'index.html';

});



//-----------------------------------------------------------------------------------------------------------------

    $('#takePic').on("click" , function () {
        $('#taking').show();
    })



//-----------------------------------------------------------------------------------------------------------------



$("#addUser").click(function()
{
    var id = 2;
    var name = $("#name").val();
    var pass = $("#password").val();
    db.transaction(function(transcation)
    {
        var sql = "INSERT INTO USERS (Id , Username , Password , IsAdmin) VALUES(?,?,?,?)";
        transcation.executeSql(sql, [id , name, pass , 0], function() {
            alert("New user is added");
            window.location.href = 'after_login.html';
        }, function(transaction,err) {
            alert(err.message);
        })
    })
});

//-----------------------------------------------------------------------------------------------------------------

$("#delete").click(function()
{
    var name = $("#name").val();
    var pass = $("#password").val();
    db.transaction(function(transcation)
    {
        var sql = "DELETE FROM USERS WHERE user_name = ? AND password = ?";
        transcation.executeSql(sql, [name, pass], function() {
            alert("This user is deleted");
        }, function(transaction,err) {
            alert(err.message);
        })
    })
});

//-----------------------------------------------------------------------------------------------------------------

/*$("#btn").click(function()
{
    var name = $("#name").val();
    var pass = $("#password").val();
    if(name == "esraa" && pass == "aaa")
    {
        window.location = "after_login.html";
    }
    else
    {
        alert("user not found");
    } 
});*/

//-----------------------------------------------------------------------------------------------------------------

/*$("#btn").click(function()
{
    var name = $("#name").val();
    var pass = $("#password").val();

    db.transaction(function(transcation)
    {
        var sql = "SELECT * FROM USERS WHERE user_name = ? AND password = ?";
        transcation.executeSql(sql, [name, pass], function() {
            if(name == sql.name && pass == sql.pass)
            {
                window.location = "after_login.html";
            }
            else
            {
                alert("user not found");
            }
            //alert("name is " + name + " password is " + pass);
        }, function(transaction,err) {
            alert(err.message);
        })
    })

});*/


//-----------------------------------------------------------------------------------------------------

$('#buyItem').on("click" , function () {

    var itemName = $('#itemName').val();
    var quantity = $('#quantity').val();
    var imgBase = sessionStorage.imgBase;

    db.transaction(function (tx) {


        var sql = 'INSERT INTO Items (Id , Name , Quantity , Picture) VALUES (? , ? , ? , ?)';
        tx.executeSql(sql , [1 , itemName , quantity , imgBase] , function () {
            alert('Item Added successfully');
        })
    })



});


//-----------------------------------------------------------------------------------------------------



    $('#sellItem').on("click" , function () {

        var soldItemName = $('#itemName').val();
        var soldItemQuantity = $('#quantity').val();
        var cstName = $('#cstName').val();


        db.transaction(function (tx) {

            tx.executeSql('SELECT * FROM Items WHERE Name = "'+soldItemName+'"' , [] , function (tx , results) {

                var records = results.rows.length;


                if(records > 0 ){



                    var id = results.rows[0]['Id'];
                    var oldQ = results.rows[0]['Quantity'];



                    
                    var sql = 'UPDATE Items SET Quantity = ? WHERE Id = ?';

                    tx.executeSql(sql , [oldQ - soldItemQuantity , id] , function () {

                        var today = new Date();




                        var sql2 = 'INSERT into Invoice (Id , Date , CustomerName , Type , ItemName , Quantity) values (?,?,?,?,?,?) ';

                        tx.executeSql(sql2 , [1 , today.getDate() , cstName , 'sell' , soldItemName , soldItemQuantity] , function () {

                            alert("invoice created successfully")

                        })
                        
                    })

                }

            })

        })


    });












});