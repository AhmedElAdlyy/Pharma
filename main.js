var db = openDatabase("Pharmacy", "1.0", "Pharmacy", 2 * 1024 * 1024);

$(function()
{
    db.transaction(function(transcation)
    {
        var sql = "CREATE TABLE USERS" + "(user_name  VARCHAR(100) NOT NULL," + "password INTEGER NOT NULL)";
        
    })

//-----------------------------------------------------------------------------------------------------------------
$("#add").click(function()
{
    var name = $("#name").val();
    var pass = $("#password").val();
    db.transaction(function(transcation)
    {
        var sql = "INSERT INTO USERS (user_name, password) VALUES(?,?)";
        transcation.executeSql(sql, [name, pass], function() {
            alert("New user is added");
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

$("#btn").click(function()
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

});












});