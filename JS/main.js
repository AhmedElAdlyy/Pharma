var db = openDatabase("Pharmacy", "1.0", "Pharmacy", 2 * 1024 * 1024);

$(function () {

    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Users (Id UNIQUE , Username , Password , IsAdmin)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Items (Id UNIQUE , Name , Quantity , Picture)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Invoice (Id UNIQUE , TransactionDate , CustomerName , Type , ItemName , Quantity)');


        tx.executeSql('INSERT INTO USERS (Id , Username , Password , IsAdmin) VALUES (1 , "Admin" , "123" , TRUE )');

    });

    db.transaction(function (tx) {
        tx.executeSql('SELECT COUNT(Id) AS lastId FROM Users', [], function (tx, results) {
            //alert(results.rows[0]['lastId']);
            //console.log(results);
            localStorage.lastId = results.rows[0]['lastId'];
        })
    });

    db.transaction(function (tx) {
        tx.executeSql('SELECT COUNT(Id) AS lastItem FROM Items', [], function (tx, result) {
            localStorage.lastItem = result.rows[0]['lastItem'];
        })
    });

    db.transaction(function (tx) {
        tx.executeSql('SELECT COUNT(Id) AS lastInvoice FROM Invoice', [], function (tx, res) {
            localStorage.lastInvoice = res.rows[0]['lastInvoice'];
        })
    });


    if (sessionStorage.userId != null) {

        db.transaction(function (tx) {

            tx.executeSql(`SELECT Username
                           FROM Users
                           WHERE Id = ?`, [sessionStorage.userId], function (tx, results) {

                if (results.rows.length > 0) {
                    var user = results.rows[0]['Username'];
                    $('#navbarDropdownMenuLink').html(user);
                }

            })

        });


        db.transaction(function (tx) {

            tx.executeSql('SELECT IsAdmin FROM Users WHERE Id = ?', [sessionStorage.userId], function (tx, results) {

                if (results.rows.length > 0) {

                    var admin = results.rows[0]['IsAdmin'];

                    if (admin != 1) {

                        $('#addUserLink').hide();
                    }

                }

            })

        })

        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Items', [], function (tx, results) {
                if (results.rows.length == 0) {
                    $('#itemName').append('<option disabled>There is no Items</option>');
                } else {
                    $.each(results.rows, function (key, value) {
                        $('#itemName').append(`<option value="${value['Id']}" >${value['Name']}</option>`)
                    });
                }
            });
        });
    }



//-----------------------------------------------------------------------------------------------------------------

    $("#delete").click(function () {
        var name = $("#name").val();
        var pass = $("#password").val();
        db.transaction(function (transaction) {
            var sql = "DELETE FROM USERS WHERE user_name = ? AND password = ?";
            transaction.executeSql(sql, [name, pass], function () {
                alert("This user is deleted");
            }, function (transaction, err) {
                alert(err.message);
            })
        })
    });

});


function changePassword() {

    var oldPsw = $('#oldPsw').val();
    var newPsw = $('#psw').val();
    var conNewPsw = $('#conPsw').val();
    var current = sessionStorage.userId;

    if (newPsw == conNewPsw) {

        db.transaction(function (tx) {
            tx.executeSql('SELECT Password FROM Users WHERE Id =? ', [sessionStorage.userId], function (tx, res) {
                //console.log(res);
                if (res.rows[0]["Password"] == oldPsw) {

                    var updateSql = 'Update Users SET Password = ? WHERE Id = ?';

                    tx.executeSql(updateSql, [newPsw, current], function (tx, res) {
                        alert("done");
                        console.log(res);
                    });

                } else {
                    alert("wrong data");
                }
            })
        });

    } else {
        alert("Password and Confirm Password is not match!!");
    }
}


function login() {

    var username = $('#name').val();
    var pass = $('#password').val();


    db.transaction(function (tx) {

        tx.executeSql('SELECT Id FROM Users WHERE Username = ? AND Password = ?', [username, pass], function (tx, results) {

            var records = results.rows.length;

            if (records > 0) {

                sessionStorage.userId = results.rows[0]['Id'];
                window.location.href = 'after_login.html';

            } else {
                alert('not found');
            }

        })

    })
}


function addUser() {

    localStorage.lastId++;

    var name = $("#name").val();
    var pass = $("#password").val();
    db.transaction(function (transcation) {
        var sql = "INSERT INTO USERS (Id , Username , Password , IsAdmin) VALUES(?,?,?,?)";
        transcation.executeSql(sql, [localStorage.lastId, name, pass, 0], function () {
            alert("New user is added");
            window.location.href = 'after_login.html';
        }, function (transaction, err) {
            alert(err.message);
        })
    })
}

function logout() {
    sessionStorage.removeItem('userId');
    window.location.href = 'index.html';
}

function addItem() {
    var itemName = $('#itemName').val();
    var imgBase = sessionStorage.imgBase;

    db.transaction(function (tx) {

        localStorage.lastItem++;

        var sql = 'INSERT INTO Items (Id , Name , Quantity , Picture) VALUES (? , ? , ? , ?)';
        tx.executeSql(sql, [localStorage.lastItem, itemName, 0, imgBase], function () {
            alert('Item Added successfully');
        })
    })
}

function takePic() {
    $('#taking').show();
}

function addTransaction() {

    var cstName = $('#cstName').val();
    var itemId = $('#itemName').val();
    var qty = $('#quantity').val();
    var type = $('#type').val();


    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Items WHERE Id = ? ', [itemId], function (tx, res) {

            var itemName = res.rows[0]["Name"];
            var itemQuantity = res.rows[0]["Quantity"];
            localStorage.lastInvoice++;

            var d = new Date();
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();

            var fullDate = `${day} / ${month} / ${year}`;


            if (type == 1) {

                if (itemQuantity >= qty) {

                    var insertSql = 'INSERT INTO Invoice (Id , TransactionDate , CustomerName , Type , ItemName , Quantity) VALUES (? , ? , ? , ? , ? , ?)';
                    tx.executeSql(insertSql,
                        [localStorage.lastInvoice, fullDate, cstName, type, itemName, qty],
                        function (tx, res) {
                            console.log(res);
                            alert('Transaction Added');
                        });

                    tx.executeSql('UPDATE Items SET Quantity = ? WHERE Id = ?', [Number(itemQuantity) - Number(qty), itemId], function (tx, res) {
                        console.log(res);
                        alert('Item Updated with transaction');
                    })


                } else {
                    alert("You don't have that quantity");
                }

            } else if (type == 0) {


                var insertSql = 'INSERT INTO Invoice (Id , TransactionDate , CustomerName , Type , ItemName , Quantity) VALUES (? , ? , ? , ? , ? , ?)';
                tx.executeSql(insertSql,
                    [localStorage.lastInvoice, fullDate, cstName, type, itemName, qty],
                    function (tx, res) {
                        console.log(res);
                        alert('Transaction Added');
                    });

                tx.executeSql('UPDATE Items SET Quantity = ? WHERE Id = ?', [Number(qty) + Number(itemQuantity), itemId], function (tx, res) {
                    console.log(res);
                    alert('Item Updated with transaction');
                })

            } else {

                alert("Wrong Data");
            }

        });
    });

}





