"use server"
import { signIn, signOut } from "./auth";
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const dbConfig = {
  host: process.env.MYSQL_HOSTNAME,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DBNAME
};

const pool = mysql.createPool(dbConfig);

const connectToDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

const releaseConnection = async (connection) => {
  try {
    connection.release();
    console.log('Connection released');
  } catch (error) {
    console.error('Error releasing connection:', error);
    throw error;
  }
};

// connectToDatabase();
export { connectToDatabase, releaseConnection };

export const githubSignInHandler = async () => {

    await signIn("github");
  };

  export const githubSignOutInHandler = async () => {

    await signOut("github");
  };


  export const priceperf = async () => {
    const connection = await connectToDatabase();
    try {
      const [rows] = await connection.execute('SELECT soc.perfscore,phonedetails.price FROM phonedetails join soc where pid = sid order by perfscore asc;');
      // console.log(rows);
      return rows;
    }catch (error) {
      return {error: "Something went wrong"};
    }
}
export const getram = async () => {
  const connection = await connectToDatabase();
  try {
    const [rows] = await connection.execute('SELECT RAM FROM phonedetails;');
    // console.log(rows);
    return rows;
  }catch (error) {
    return {error: "Something went wrong"};
  } finally {
    await releaseConnection(connection);
  }
}
export const getuserdist = async () => {
  const connection = await connectToDatabase();
  try {
    const [rows] = await connection.execute('SELECT price,nusers FROM phonedetails;');
    return rows;
  }catch (error) {
    return {error: "Something went wrong"};
  } finally {
    await releaseConnection(connection);
  }
}
export const getrom = async () => {
  const connection = await connectToDatabase();
  try {
    const [rows] = await connection.execute('SELECT ROM FROM phonedetails;');
    // console.log(rows);
    return rows;
  }catch (error) {
    return {error: "Something went wrong"};
  } finally {
    await releaseConnection(connection);
  }
}
export const getpricerange = async () => {
  const connection = await connectToDatabase();
  try {
    const [rows] = await connection.execute('SELECT price FROM phonedetails;');
    // console.log(rows);
    return rows;
  }catch (error) {
    return {error: "Something went wrong"};
  }
}

export const discard = async(id) =>{
  const connection = await connectToDatabase();
  await connection.execute('delete from temp_phonedetails where id = ?;',[id])
  const [rows] = await connection.execute('SELECT temp_phonedetails.*,soc.ProcessorName FROM temp_phonedetails join soc where pid=sid;');
  connection.release();
  return rows;
}

export const approve = async (id) => {
  const connection = await connectToDatabase();
  
  try {
    const [rowtoapprove] = await connection.execute('SELECT * FROM temp_phonedetails WHERE id = ?', [id]);
    const objhere = rowtoapprove[0];

    const [duplicates] = await connection.execute('SELECT id FROM phonedetails WHERE pname = ? AND RAM = ? AND ROM = ?', [objhere.pname, objhere.RAM, objhere.ROM]);

    if (duplicates.length > 0) {
      const idforduplicate = duplicates[0].id;
      await connection.execute('UPDATE phonedetails SET pname = ?, price = ?, image = ?, RAM = ?, ROM = ?, DisplaySize = ?, DisplayType = ?, Battery = ?, FrontCamera = ?, RearCamera = ?, pid = ? WHERE id = ?', [
        objhere.pname, objhere.price, objhere.image, objhere.RAM, objhere.ROM, objhere.DisplaySize, objhere.DisplayType, objhere.Battery, objhere.FrontCamera, objhere.RearCamera, objhere.pid, idforduplicate
      ]);
    } else {
      await connection.execute('INSERT INTO phonedetails(pname, price, image, RAM, ROM, DisplaySize, DisplayType, Battery, FrontCamera, RearCamera, nusers, userscore, pid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        objhere.pname, objhere.price, objhere.image, objhere.RAM, objhere.ROM, objhere.DisplaySize, objhere.DisplayType, objhere.Battery, objhere.FrontCamera, objhere.RearCamera, objhere.nusers, objhere.userscore, objhere.pid
      ]);
    }

    await connection.execute('DELETE FROM temp_phonedetails WHERE id = ?', [id]);

    const [rows] = await connection.execute('SELECT temp_phonedetails.*, soc.ProcessorName FROM temp_phonedetails JOIN soc WHERE pid = sid');
    return rows;
  } catch (error) {
    // Handle error
    console.error('Error in approve function:', error);
    throw error; // Rethrow the error for external handling
  } finally {
    // Make sure to release the connection in all cases
    connection.release();
  }
};


export const register = async (previousState, formData) => {
  const {username, password, confirmpassword} = Object.fromEntries(formData);
  if(!username || !password || !confirmpassword) return {error : "Fields missing" };
  if(password !== confirmpassword) return {error : "Passwords do not match"};
  const connection = await connectToDatabase();
  try {
      const [rows] = await connection.execute(
        'SELECT * FROM Users WHERE username = ?',
        [username]
      );
      if(rows.length !== 0) return {error: "Username already exists"};
      const salt = await bcrypt.genSalt(10);
      const hashpass = await bcrypt.hash(password,salt);
      if (rows.length === 0) {
        await connection.execute(
          'INSERT INTO Users (username,password,isadmin) VALUES (?, ?, ?)',
          [username,hashpass,0]
        );
      }
      return {success : true};
    } catch (error) {
      return {error: "Something went wrong"};
    } finally {
      await releaseConnection(connection);
    }
}
export const submitforreview = async (formData) => {
  const connection = await connectToDatabase();
  await connection.execute(
    'INSERT INTO temp_phonedetails (pname,price,image,RAM,ROM,FrontCamera,RearCamera,Battery,DisplaySize,DisplayType,pid) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [...formData])
  // );
}

export const toreview = async() => {
  const connection = await connectToDatabase();
  const [rows] = await connection.execute('SELECT temp_phonedetails.*,soc.ProcessorName FROM temp_phonedetails join soc where pid=sid;');
  return rows;
}

export const login = async (previousState, formData) => {
  const {username, password} = Object.fromEntries(formData);
  console.log(username,password);
  try {
      await signIn("credentials",{username, password});
    } catch (error) {
      console.log(error.message);
      if(error.message.includes("credentialssignin")){
        return {error : "Invalid username or password"}
      }
      throw error;
    }
}
export const getsocs = async()=>{
  const connection = await connectToDatabase();
  const [rows] = await connection.execute('SELECT * FROM soc');
  return rows;
}
export const chat = async (Query, retryCount = 3) => {
  try {
    // Make POST request to the API
    let response = await fetch('http://127.0.0.1:5000/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question: Query })
    });

    // Wait for the response
    if(!Query.includes("give sql syntax and ")){
      Query += ' give sql syntax and select all attributes of phonedetails and soc table like, SELECT phonedetails.*, soc.ProcessorName FROM phonedetails JOIN soc ON phonedetails.pid = soc.sid;';
    }
    let apiResponse = await response.json();
    
    // Check if the API response starts with "SELECT *"
    if (!apiResponse.startsWith('SELECT phonedetails.*')) {
      // If it doesn't, append "SELECT * FROM phonedetails" to the query
      if(!Query.includes(' give sql syntax and select all the attributes of phonedetails and soc table and limit to 10 rows')) Query += ' give sql syntax and select all the attributes of phonedetails and soc table and limit to 10 rows';
      response = await fetch('http://127.0.0.1:5000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: Query })
      });
  
      // Wait for the response
      apiResponse = await response.json();
    } else {
      // Otherwise, use the API response as the query
      Query = apiResponse;
    }

    // Connect to the database
    const connection = await connectToDatabase();

    // Execute the query
    const [rows] = await connection.query(Query);

    // Release the database connection
    await connection.release();

    // Return the result if needed
    return rows;
  } catch (error) {
    // Handle errors
    console.error('Error executing query:', error);
    // Retry logic
    if (retryCount > 0) {
      console.log(`Retrying... Attempt ${retryCount}`);
      return chat(Query, retryCount - 1); // Retry with decremented retry count
    } else {
      // Retry limit reached, throw error
      throw new Error('Retry limit reached. Unable to execute query.');
    }
  }
};
