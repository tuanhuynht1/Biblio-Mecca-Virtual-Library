const { Client } = require("pg");

class PostgresInterface {
  /* ------------------------------------------------------------------------------------------------------------------- */
  constructor(connectionString) {
    this.connectionString = connectionString;
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  async connect() {
    const client = new Client({ connectionString: this.connectionString });
    try {
      await client.connect();
    } catch (e) {
      console.log(e);
    }
    return client; // returns client object to query, must close each use
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  async close(client) {
    try {
      await client.end();
    } catch (e) {
      console.log(e);
    }
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  async createNewPatron(user, pass, fn, ln, DOB, addr, phone, email) {
    const client = await this.connect();
    try {
      await client.query(`
                INSERT INTO patrons
                VALUES ('${user}','${pass}','${fn}','${ln}','${DOB}','${addr}','${phone}','${email}');
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  async createNewLibrarian(LID, pass, fn, ln) {
    const client = await this.connect();
    try {
      await client.query(`
                INSERT INTO librarians
                VALUES (${LID},'${pass}','${fn}','${ln}');
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  async issueNewCard(CID, user, LID, reason) {
    const client = await this.connect();
    try {
      await client.query(`
                INSERT INTO cards
                VALUES (${CID},'${user}','${LID}',DEFAULT,'${reason}');
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  //need to check if book is availble or not
  async checkoutBook(bid, user) {
    const client = await this.connect();
    try {
      await client.query(`
                INSERT INTO checkout
                VALUES (${bid},'${user}',DEFAULT,NULL,DEFAULT);
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  // online Checkout: do we need to add connect and close
  async onlineCheckout(isbn, user) {
    var avaBooks = await this.availableBook(isbn);
    if (avaBooks.length > 0) await this.checkoutBook(avaBooks[0]["bid"], user);
    else console.log("No book availble with ISBN" + isbn);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  async placeHold(user, isbn) {
    const client = await this.connect();
    try {
      await client.query(`
                INSERT INTO holds
                VALUES ('${user}','${isbn}',DEFAULT,NULL,NULL);
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  async searchBook(search, by) {
    // Add DISTINCT and remove join between bookinfo and books
    const client = await this.connect();
    try {
      if (by == "format") {
        const { rows } = await client.query(`
                    SELECT DISTINCT title,author,category,ISBN,format
                    FROM bookinfo
                    WHERE lower(${by}) LIKE 
                        '${search.substring(0, 1).toLowerCase()}%'
                    ORDER BY title;
                `);
        await this.close(client);
        return rows;
      } else {
        const { rows } = await client.query(`
                    SELECT DISTINCT title,author,category,ISBN,format
                    FROM bookinfo
                    WHERE lower(${by}) LIKE '${search.toLowerCase()}%'
                    ORDER BY title;
                `);
        await this.close(client);
        return rows;
      }
      // if(by === 'isbn' || by === 'format'){
      //     const { rows } = await client.query(`
      //         SELECT DISTINCT title,author,ISBN,format
      //         FROM bookinfo
      //         WHERE  ${by} = '${search}';
      //     `);
      //     await this.close(client);
      //     return rows;
      // }
      // else if (by === 'title' || by === 'author' || by === 'category'){
      //     const { rows } = await client.query(`
      //         SELECT DISTINCT title,author,ISBN,format
      //         FROM bookinfo
      //         WHERE lower(${by}) LIKE '%${search.toLowerCase()}%';
      //     `);
      //     await this.close(client);
      //     return rows;
      // }
      // await this.close(client);
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  async viewAll(table) {
    const client = await this.connect();
    try {
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
  async viewPatronInfo(username) {
    const client = await this.connect();
    try {
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
  async authenticateLogin(user, pusername, lib_id, pass) {
    //'null' if not apply to any argument, ex: authenticateLogin('patron', 'qizheng2', 'NULL','bogarted')
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
                SELECT * FROM login ('${user}', '${pusername}', ${lib_id},'${pass}');
            `);
      await this.close(client);
      return rows[0]["login"];
      // if (user === 'patron') {
      //     const { rowCount } = await client.query(`
      //         SELECT *
      //         FROM patrons
      //         WHERE username = '${id}' AND password = '${pass}';
      //     `);
      //     await this.close(client);
      //     if (rowCount === 1) return true;
      // }
      // else if (user === 'librarian'){
      //     const { rowCount } = await client.query(`
      //         SELECT *
      //         FROM librarians
      //         WHERE LID = ${id} AND password = '${pass}';
      //     `);
      //     await this.close(client);
      //     if (rowCount === 1) return true;
      // }
      // else{
      //     await this.close(client);
      //     console.log('user-type error');
      // }
      // return false;
    } catch (e) {
      console.log(e);
      await this.close(client);
      return false;
    }
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  async viewCheckoutHistory(user) {
    const client = await this.connect();
    try {
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
  async availableBook(isbn) {
    //for online checkout: return all books with isbn that has not been checkout
    const client = await this.connect();
    try {
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
  async checkinBook(bid) {
    //book check in and update if there is a late fee or not
    const client = await this.connect();
    try {
      await client.query(`
                UPDATE checkout
                SET check_In_Date = NOW()
                WHERE bid = '${bid}' AND check_in_date IS NULL;
            `);
      await this.close(client);
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }

  /* -------------------------------------------------------------------------------------------------------------------*/
  async bookStatus() {
    //a list of books in the library with its current status
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
                SELECT * FROM Books_Status_View;
            `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  /* -------------------------------------------------------------------------------------------------------------------*/
  async viewLateFee(user, id) {
    //librarian can view all the unpay late fee and patron can view their, late fee will not pass $20
    const client = await this.connect();
    try {
      if (user === "librarian" && id === "null") {
        const { rows } = await client.query(`
                    SELECT * FROM Late_Fee_View;
                `);
        await this.close(client);
        return rows;
      } else if (user === "patron" && id != "null") {
        const { rows } = await client.query(`
                    SELECT * 
                    FROM late_fee_view 
                    WHERE username='${id}';
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
  /*-------------------------------------------------------------------------------------------------------------------*/
  //add book to books tables
  async addBookToBooks(bid, isbn) {
    const client = await this.connect();
    try {
      await client.query(`
                INSERT INTO books VALUES ('${bid}','${isbn}');
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  //Add books to bookinfo tables
  async addBookToBookInfo(isbn, title, author, category, format) {
    const client = await this.connect();
    try {
      await client.query(`
                INSERT INTO Bookinfo VALUES ('${isbn}', ''${title}'',''${author},'${category}','${format}');
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  //only remove from books tables: NEED TO CHECK if there is other books left with same isbn if not also remove from bookinfo table
  async removeBookFromBooks(bid) {
    const client = await this.connect();
    try {
      await client.query(`
                DELETE FROM books WHERE bid='${bid}';
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  //database automatic remove books from books table that have same isbn
  async removeBookFromBookinfo(isbn) {
    const client = await this.connect();
    try {
      await client.query(`
                DELETE FROM bookinfo WHERE bid='${isbn}';
            `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
}

/* ------------------------------------------------------------------------------------------------------------------- */
module.exports = { PostgresInterface: PostgresInterface };
/* ------------------------------------------------------------------------------------------------------------------- */

/*Trigger: holds
CREATE or replace FUNCTION update_holds() RETURNS trigger AS
$BODY$
BEGIN
UPDATE holds
SET available_on = NOW(), bid=NEW.bid
WHERE request_on = (SELECT MIN (request_on) FROM Holds) 
      AND NEW.bid IN 
(SELECT books.bid FROM books JOIN holds ON books.isbn=holds.isbn);
RETURN NEW;
END
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER tr_check_holds
AFTER UPDATE OF Check_in_date
ON checkout
FOR EACH ROW
WHEN (NEW.check_in_date IS NOT NULL)
EXECUTE PROCEDURE update_holds();

*/
/*trigger late fee
CREATE or replace FUNCTION update_late_fee() RETURNS trigger AS
  $BODY$
BEGIN
  UPDATE checkout
  SET has_late_fee= true
  WHERE check_in_date =NEW.check_in_date AND (check_in_date-check_out_date)>'21 days';
  RETURN NEW;
END
$BODY$
LANGUAGE plpgsql;


CREATE TRIGGER tr_late_fee
	AFTER UPDATE OF check_in_date
	ON checkout
	FOR EACH ROW
	WHEN (NEW.check_in_date IS NOT NULL)
    EXECUTE PROCEDURE update_late_fee(); */

/*View */
/*CREATE VIEW books_status_view AS
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
        FROM Bookinfo NATURAL JOIN Books ORDER BY Bid; 
        
        
        CREATE VIEW Late_Fee_view AS
            SELECT bid, username, check_out_date, check_in_date, 
            CASE WHEN (SELECT cal_late_fee(date(check_in_date),date(check_out_date)))<20
                THEN '$ '||(SELECT cal_late_fee(date(check_in_date),date(check_out_date)))
                ELSE '$ 20.00'
                END AS late_fee_amount
            FROM checkout
            WHERE has_late_fee = true AND check_in_date IS NOT NULL
			ORDER BY late_fee_amount,username;
*/

/*function calculate late fee

CREATE FUNCTION cal_late_fee(check_in_date date, check_out_date date) RETURNS decimal(5,2) AS $$
BEGIN
	IF(check_in_date-check_out_date)<=21 THEN
		RETURN 0;
	ELSE 
RETURN (check_in_date-check_out_date-21)*0.1;
	END IF;
END; $$
LANGUAGE PLPGSQL;


//function login
CREATE FUNCTION login (userType VARCHAR, pusername VARCHAR, lib_id INTEGER, pass VARCHAR) RETURNS boolean AS $$
BEGIN
    IF ((userType='patron' AND (SELECT COUNT(*) FROM patrons WHERE username=pusername AND password=pass)=1)
        OR (userType='librarian' AND (SELECT COUNT(*) FROM librarians WHERE lid=lib_id AND password=pass)=1)) 
        THEN 
        RETURN true;
    ELSE RETURN false;
    END IF;
END; $$
LANGUAGE PLPGSQL;*/
