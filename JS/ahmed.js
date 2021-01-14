var db = openDatabase("Pharmacy", "1.0", "Pharmacy", 2 * 1024 * 1024);

db.transaction(function (tx) {

    //tx.executeSql('CREATE TABLE if NOT EXISTS Users (Id UNIQUE , Username , Password , IsAdmin)');
    //tx.executeSql('INSERT INTO USERS (Id , Username ,Password, IsAdmin) VALUES (1 , "Admin" , "123" ,TRUE )');

    tx.executeSql('DROP TABLE Users');



})