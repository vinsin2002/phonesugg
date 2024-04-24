export const authConfig = {
    pages: {
      signIn: "/login",
    },
    providers: [],
    callbacks: {
      // FOR MORE DETAIL ABOUT CALLBACK FUNCTIONS CHECK https://next-auth.js.org/configuration/callbacks
      async jwt({token,user}){
          if(user){
            token.username = user.username;
            token.id = user.id;
            token.isadmin = user.isadmin;
          }
          return token;
      },
      async session({session,token}){
        if(token){
        session.user.name = token.username;
        session.user.id = token.id;
        session.user.isadmin = token.isadmin;
        }
        return session;
      },
      authorized({auth,request}){
        const user = auth?.user;
        const isonadminpanel = request.nextUrl?.pathname.startsWith("/admin");
        const isonloginpage = request.nextUrl?.pathname.startsWith("/login");
        const isonregisterpage = request.nextUrl?.pathname.startsWith("/register");
        const isonchatpage = request.nextUrl?.pathname.startsWith("/chat");
        const isoncontributepage = request.nextUrl?.pathname.startsWith("/contribute");

        if(isonchatpage && !user){
          return false;
        }
        if(isoncontributepage && !user){
          return false;
        }
        if(isonadminpanel && !user?.isadmin){ return false; }
        if(isonregisterpage && user){
          return Response.redirect(new URL("/",request.nextUrl));
        }

        if(isonloginpage && user){
          if (isoncontributepage) {
            return Response.redirect(new URL("/contribute", request.nextUrl));
          } else {
            return Response.redirect(new URL("/chat", request.nextUrl));
          }
        }
        return true;
      }
    },
  };
  