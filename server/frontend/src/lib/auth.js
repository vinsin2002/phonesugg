import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase, releaseConnection } from './actions';
import bcrypt from 'bcrypt';
import { authConfig } from "./auth.config";
const login = async(credentials) =>{ 
  try{
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(
      'SELECT * FROM Users WHERE username = ?',
      [credentials.username]
    );
    if(rows.length === 0) throw new Error("User not found, Please register this user");
      const ispasswordcorrect = await bcrypt.compare(credentials.password,rows[0].password);
      if(!ispasswordcorrect) throw new Error("Wrong password!");
      return rows[0];
  }catch(err){
    console.log(err);
    throw new Error("Failed to login");
  }
};

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [GitHub({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET
  }),
  CredentialsProvider({
    async authorize(credentials){
        try{
          const user = await login(credentials);
          return user;
        }catch(err){
          return null;
        }
    }
  })
],
  callbacks: {
    async signIn(user) {
      if (user.account && user.account.provider === "github") {
        const connection = await connectToDatabase();
        try {
            const [rows] = await connection.execute(
              'SELECT * FROM Users WHERE username = ?',
              [user.profile.login]
            );
            if (rows.length === 0) {
              await connection.execute(
                'INSERT INTO Users (username, isadmin) VALUES (?, ?)',
                [user.profile.login, 0]
              );
            }
          } catch (error) {
            console.error('Error executing database query:', error);
          } finally {
            await releaseConnection(connection);
          }
        }
      return true;
    }
    , ...authConfig.callbacks,
  }
});
