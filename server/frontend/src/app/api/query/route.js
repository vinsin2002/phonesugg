import { connectToDatabase, releaseConnection } from '@/lib/actions';
import {NextResponse} from 'next/server'
import bodyParser from 'body-parser';

export const GET = async(request) => {
  try{
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(
      'SELECT pname FROM phonedetails WHERE battery >= 5000 limit 5',
    );
    await releaseConnection();
    return NextResponse.json(rows,{status:200});
  }catch(err){
    console.log(err);
    throw new Error("Fuck");
  }
}

