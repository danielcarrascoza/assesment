
import {useSession, signIn, signOut} from "next-auth/react";
import {DefaultSession} from "next-auth";


export function createUser(){

    return(
        signIn(),
        make()
    )
}

const make = async () => {
    const { data: session } = useSession();

    if (!session?.user) return;

    const response = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: session?.user.name,
        email: session?.user.email
      }),
    });
}
