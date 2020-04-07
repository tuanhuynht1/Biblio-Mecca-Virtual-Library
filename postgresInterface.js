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
    console.log('WORLD', bid, user);
    try {
      await client.query(`
                INSERT INTO checkout
                VALUES (${bid},'${user}',DEFAULT,NULL);
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
    console.log('HELLO',avaBooks);
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
  async browseBook() {
    const client = await this.connect();
    try {
      const { rows } = await client.query(`
        SELECT title, author, isbn, format, COUNT(*)
        FROM books_status_view 
        WHERE (status <> 'OUT' AND status <> 'ON HOLD')
        GROUP BY isbn,title, author, format
        ORDER BY title;
      `);
      await this.close(client);
      return rows;
    } catch (error) {
      await this.close(client);
      console.log(error);
    }
  }
  /* ------------------------------------------------------------------------------------------------------------------- */
  
  async searchBook(search, by) {
    // Add DISTINCT and remove join between bookinfo and books
    const client = await this.connect();
    try {
      if (by == "format") {
        const { rows } = await client.query(`
			SELECT title, author, isbn, format, COUNT(*)
			FROM books_status_view 
			WHERE lower(${by}) LIKE 
                  '${search.substring(0, 1).toLowerCase()}%'
            AND (status <> 'OUT' AND status <> 'ON HOLD')
			GROUP BY isbn,title, author, format
			ORDER BY title;
                `);
        await this.close(client);
        return rows;
      } else {
        const { rows } = await client.query(`
			SELECT title, author, isbn, format, COUNT(*)
			FROM books_status_view 
      WHERE lower(${by}) LIKE '${search.toLowerCase()}%'
            AND (status <> 'OUT' AND status <> 'ON HOLD')
			GROUP BY isbn,title, author, format
			ORDER BY title;
					
                `);
        await this.close(client);
        return rows;
      }
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
                SELECT Fname,Lname,DOB,Address,Phone_Number, '$ '||late_fee_amount AS late_fee_amount
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
		  SELECT bid,title,author,ISBN,check_out_date,check_in_date,format
          FROM
              (SELECT * 
              FROM patrons NATURAL JOIN checkout 
              WHERE username = '${user}') AS books_checkout_by_user 
              NATURAL JOIN books NATURAL JOIN bookinfo
          ORDER BY check_out_date DESC;
      `);
      await this.close(client);
      return rows;
    } catch (e) {
      console.log(e);
      await this.close(client);
    }
  }

    async checkMyHold(user) {
      const client = await this.connect();
      try {
        const { rows } = await client.query(`
            SELECT isbn,title, author, 
                   CASE WHEN format='A' THEN 'AudioBook' 
                        WHEN format='E' THEN 'EBook' 
                        WHEN format='P' THEN 'Physical' 
                   END AS format, 
                   request_on, available_on, bid 
            FROM holds NATURAL JOIN bookinfo 
            WHERE username ='${user}'
            ORDER BY request_on;
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
  //remove a specific book with bid
  async removeSpecificBook(bid) {
    const client = await this.connect();
    try {
      await client.query(`
          SELECT remove_specific_book('${bid}');
      `);
    } catch (e) {
      console.log(e);
    }
    await this.close(client);
  }
  //database automatic remove books from books table that have same isbn
  async removeBookBasedOnISBN(isbn) {
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

// SELECT *, pg_terminate_backend(pid) 
// FROM pg_stat_activity 
// WHERE usename='postgres';