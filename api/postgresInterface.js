const { Client } = require('pg');

class PostgresInterface{
/* ------------------------------------------------------------------------------------------------------------------- */
    constructor(connectionString){
        this.connectionString = connectionString;
    }
/* ------------------------------------------------------------------------------------------------------------------- */
    async connect(){
        const client = new Client({connectionString: this.connectionString});
        try{
            await client.connect();        
        } catch(e) { console.log(e) }
        return client;  // returns client object to query, must close each use
    }
/* ------------------------------------------------------------------------------------------------------------------- */
    async close(client){
        try{
            await client.end();
        } catch (e) { console.log(e) }
    }
/* ------------------------------------------------------------------------------------------------------------------- */
    async createNewPatron(user, pass, fn, ln, DOB, addr, phone, email){
        const client = await this.connect();
        try{
            await client.query(`
                INSERT INTO patrons
                VALUES ('${user}','${pass}','${fn}','${ln}','${DOB}','${addr}','${phone}','${email}');
            `);
        } catch (e) { console.log(e) } 
        await this.close(client);
    }
/* ------------------------------------------------------------------------------------------------------------------- */
    async createNewLibrarian(LID, pass, fn, ln){
        const client = await this.connect();
        try{
            await client.query(`
                INSERT INTO librarians
                VALUES (${LID},'${pass}','${fn}','${ln}');
            `);
        } catch(e) { console.log(e) }
        await this.close(client);
    }
/* ------------------------------------------------------------------------------------------------------------------- */
    async issueNewCard(CID,user,LID,reason){
        const client = await this.connect();
        try{
            await client.query(`
                INSERT INTO cards
                VALUES (${CID},'${user}','${LID}',DEFAULT,'${reason}');
            `);
        } catch (e) { console.log(e) }
        await this.close(client);
    }
/* ------------------------------------------------------------------------------------------------------------------- */
    //need to check if book is availble or not
    async checkoutBook(bid,user){
        const client = await this.connect();
        try{
            await client.query(`
                INSERT INTO checkout
                VALUES (${bid},'${user}',DEFAULT,NULL,DEFAULT);
            `);
        } catch (e) { console.log(e) }
        await this.close(client);
    }
/* ------------------------------------------------------------------------------------------------------------------- */
    async placeHold(user,isbn){
        const client = await this.connect();
        try{
            await client.query(`
                INSERT INTO holds
                VALUES ('${user}','${isbn}',DEFAULT,NULL,NULL);
            `);
        } catch (e) { console.log(e) }
        await this.close(client);
    }
/* ------------------------------------------------------------------------------------------------------------------- */
    async searchBook(search,by){    // Add DISTINCT and remove join between bookinfo and books
        const client = await this.connect();
        try{
            if(by === 'isbn' || by === 'format'){
                const { rows } = await client.query(`
                    SELECT DISTINCT title,author,ISBN,format
                    FROM bookinfo
                    WHERE  ${by} = '${search}'; 
                `);
                await this.close(client);
                return rows;    
            }
            else if (by === 'title' || by === 'author' || by === 'category'){
                const { rows } = await client.query(`
                    SELECT DISTINCT title,author,ISBN,format
                    FROM bookinfo
                    WHERE lower(${by}) LIKE '%${search.toLowerCase()}%';
                `);
                await this.close(client);
                return rows;
            }
            await this.close(client);
        } catch (e) { 
            console.log(e);
            await this.close(client); 
        }
    }
/* ------------------------------------------------------------------------------------------------------------------- */
    async viewAll(table){
        const client = await this.connect();
        try{
            const { rows } = await client.query(`
                SELECT * 
                FROM ${table};
            `);
            await this.close(client);
            return rows;   
        } catch (e) { 
            console.log(e);
            await this.close(client);  
        }      
    }
/* ------------------------------------------------------------------------------------------------------------------- */
    async viewPatronInfo(username){
        const client = await this.connect();
        try{
            const { rows } = await client.query(`
                SELECT Fname,Lname,DOB,Address,Phone_Number
                FROM patrons
                WHERE Username = '${username}';
            `);
            await this.close(client);
            return rows;
        } catch (e) {
            console.log(e);
            await this.close(client);
        }
    }
/* ------------------------------------------------------------------------------------------------------------------- */
    async authenticateLogin(user,id,pass,){
        const client = await this.connect();
        try{
            if (user === 'patron') {
                const { rowCount } = await client.query(`
                    SELECT * 
                    FROM patrons
                    WHERE username = '${id}' AND password = '${pass}';
                `);
                await this.close(client);
                if (rowCount === 1) return true;
            }
            else if (user === 'librarian'){
                const { rowCount } = await client.query(`
                    SELECT * 
                    FROM librarians
                    WHERE LID = ${id} AND password = '${pass}';
                `);
                await this.close(client);
                if (rowCount === 1) return true;
            }
            else{
                await this.close(client);
                console.log('user-type error');
            }
            return false;
        } catch (e) {
            console.log(e);
            await this.close(client);
            return false;
        }
    }
/* ------------------------------------------------------------------------------------------------------------------- */
    async viewCheckoutHistory(user){
        const client = await this.connect();
        try{
            const { rows } = await client.query(`
                SELECT bid,title,author,ISBN,check_out_date,check_in_date,has_late_fee
                FROM
                    (SELECT * 
                    FROM patrons NATURAL JOIN checkout 
                    WHERE username = '${user}') AS books_checkout_by_user 
                    NATURAL JOIN books NATURAL JOIN bookinfo;
            `);
            await this.close(client);
            return rows;
        } catch (e) {
            console.log(e);
            await this.close(client);
        }
    }
/* ------------------------------------------------------------------------------------------------------------------- */
//ADDED BY QI
/* -------------------------------------------------------------------------------------------------------------------*/
    async availableBook(isbn){  //for online checkout: return all books with isbn that has not been checkout
        const client = await this.connect();
        try{
            const { rows } = await client.query(`
                SELECT * FROM
                (SELECT BID FROM books NATURAL JOIN bookinfo WHERE ISBN = '${isbn}' AND Format IN ('E','A') 
                    EXCEPT
                    (SELECT BID 
                    FROM checkout 
                    WHERE check_In_Date IS NULL)) 
                    AS available;
            `);
            await this.close(client);
            return rows;
        } catch (e) {
            console.log(e);
            await this.close(client);
        }
    }

/* ------------------------------------------------------------------------------------------------------------------- */
    async checkinBook(bid){     //book check in and update if there is a late fee or not
        const client = await this.connect();
        try{
            await client.query(`
                UPDATE checkout
                SET check_In_Date = NOW()
                WHERE bid = '${bid}' AND check_in_date IS NULL;

                UPDATE checkout
                SET has_late_fee = TRUE
                WHERE bid = '${bid}' 
                    AND check_in_date =
                        (SELECT MAX(check_in_date) FROM checkout) 
                    AND (check_in_date-check_out_date)>'21 days';
            `);
            await this.close(client);
        } catch (e) { 
            console.log(e) 
            await this.close(client);}
    }

/* -------------------------------------------------------------------------------------------------------------------*/
    async bookStatus(){     //a list of books in the library with its current status
        const client = await this.connect();
        try{
            const { rows } = await client.query(`
                SELECT bid,title,author,ISBN,format, 
                    CASE WHEN BID IN
                            (SELECT bid
                            FROM holds
                            WHERE bid IS NOT NULL)
                        THEN 'ON HOLD'
                        WHEN BID IN
                            (SELECT bid FROM books
                            EXCEPT
                            (SELECT bid 
                            FROM checkout 
                            WHERE check_in_date IS NULL))
                        THEN 'IN'
                        ELSE 'OUT'
                    END AS Status
                FROM Bookinfo NATURAL JOIN Books;
            `);
            await this.close(client);
            return rows;
        } catch (e) { console.log(e) }
        await this.close(client);
    }
/* -------------------------------------------------------------------------------------------------------------------*/
    async viewLateFee(user){    //librarian can view all the unpay late fee and patron can view their
        const client = await this.connect();
        try
        {
            if(user==='librarian'){
                const { rows } = await client.query(`
                    SELECT bid, username, check_out_date, check_in_date, 
                    (DATE_PART('day',check_in_date-check_out_date))*0.1 AS late_fee_amount
                    FROM checkout 
                    WHERE has_late_fee = true AND (check_in_date-check_out_date)>'21 days';
                `);
                await this.close(client);
                return rows;
            }
            else{
                const { rows } = await client.query(`
                    SELECT bid, username, check_out_date, check_in_date, 
                    (DATE_PART('day',check_in_date-check_out_date))*0.1 AS late_fee_amount
                    FROM checkout 
                    WHERE Username = '${user}' AND has_late_fee = true AND (check_in_date-check_out_date)>'21 days';
                `);
                await this.close(client);
                return rows;
            }
        } catch (e) {
            console.log(e);
            await this.close(client);
            }
    }
    /*-------------------------------------------------------------------------------------------------------------------*/
    
}

/* ------------------------------------------------------------------------------------------------------------------- */
module.exports = {PostgresInterface: PostgresInterface};
/* ------------------------------------------------------------------------------------------------------------------- */



/*Trigger: holds
CREATE or replace FUNCTION update_holds() RETURNS trigger AS
  $BODY$
BEGIN
  UPDATE holds
  set available_on = NOW(), bid=NEW.bid
  WHERE request_on = (SELECT MIN (request_on) FROM Holds)
  		AND NEW.bid IN (SELECT books.bid FROM books JOIN holds ON books.isbn=holds.isbn);
  RETURN NEW;
END
$BODY$
LANGUAGE plpgsql;


CREATE TRIGGER tr_check_holds
	AFTER UPDATE 
	ON checkout
	FOR EACH ROW
	EXECUTE PROCEDURE update_holds(); 


*/